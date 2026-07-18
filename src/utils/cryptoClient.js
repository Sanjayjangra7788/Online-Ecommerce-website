// src/utils/cryptoClient.js
// Encrypts request payloads client-side (AES-256-GCM) before sending,
// so the raw JSON never appears in DevTools > Network > Payload.
//
// NOTE: The key is bundled into the JS sent to the browser (like any
// VITE_ env var), so this does NOT add protection against a determined
// attacker inspecting the source. It DOES stop plain email/password
// from appearing in the Network tab payload viewer. Real transport
// security still comes from HTTPS — this is a UX/obscurity layer on
// top of it.

const KEY_B64 = import.meta.env.VITE_PAYLOAD_KEY;

function b64ToBytes(b64) {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

function bytesToB64(bytes) {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

async function getKey() {
  const keyData = b64ToBytes(KEY_B64);
  return crypto.subtle.importKey("raw", keyData, "AES-GCM", false, ["encrypt"]);
}

export async function encryptPayload(obj) {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(obj));
  const cipherBuf = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  return {
    iv: bytesToB64(iv),
    data: bytesToB64(new Uint8Array(cipherBuf)),
  };
}
