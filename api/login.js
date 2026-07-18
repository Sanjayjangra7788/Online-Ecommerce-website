// // api/login.js
// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   const { email, password } = req.body;

//   try {
//     const rawDomain = process.env.AUTH0_DOMAIN || "";
//     const rawClientId = process.env.AUTH0_CLIENT_ID || "";
//     const targetUrl = `https://${rawDomain}/oauth/token`;
//     console.log("DEBUG domain (escaped):", JSON.stringify(rawDomain));
//     console.log("DEBUG domain length:", rawDomain.length, "expected: 33");
//     console.log("DEBUG client_id (escaped):", JSON.stringify(rawClientId));
//     console.log("DEBUG client_id length:", rawClientId.length, "expected: 32");

//     const response = await fetch(targetUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         grant_type: "http://auth0.com/oauth/grant-type/password-realm",
//         realm: "Username-Password-Authentication",
//         username: email,
//         password: password,
//         client_id: process.env.AUTH0_CLIENT_ID,
//         scope: "openid profile email",
//       }),
//     });

//     const rawText = await response.text();
//     console.log("DEBUG raw response:", rawText.slice(0, 300));

//     let data;
//     try {
//       data = JSON.parse(rawText);
//     } catch {
//       return res.status(502).json({
//         error: "bad_upstream_response",
//         error_description: rawText.slice(0, 200),
//         debug_url: targetUrl,
//       });
//     }

//     if (!response.ok) {
//       return res.status(response.status).json(data);
//     }

//     return res.status(200).json(data);
//   } catch (err) {
//     return res.status(500).json({ error: "server_error", error_description: err.message });
//   }
// }


// api/login.js
import crypto from "crypto";

function decryptPayload(ivB64, dataB64) {
  const key = Buffer.from(process.env.PAYLOAD_KEY, "base64"); // 32 bytes
  const iv = Buffer.from(ivB64, "base64");
  const full = Buffer.from(dataB64, "base64");

  // Web Crypto's AES-GCM ciphertext = ciphertext + 16-byte auth tag (appended)
  const authTag = full.subarray(full.length - 16);
  const ciphertext = full.subarray(0, full.length - 16);

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return JSON.parse(decrypted.toString("utf8"));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let email, password;
  try {
    const { iv, data } = req.body;
    ({ email, password } = decryptPayload(iv, data));
  } catch {
    return res.status(400).json({ error: "invalid_payload", error_description: "Could not decrypt request" });
  }

  try {
    const domain = process.env.AUTH0_DOMAIN;
    const clientId = process.env.AUTH0_CLIENT_ID;

    // ── Step 1: Exchange credentials for a token ──────────────────
    const tokenRes = await fetch(`https://${domain}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "http://auth0.com/oauth/grant-type/password-realm",
        realm: "Username-Password-Authentication",
        username: email,
        password: password,
        client_id: clientId,
        scope: "openid profile email",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      return res.status(tokenRes.status).json(tokenData);
    }

    const accessToken = tokenData.access_token;

    // ── Step 2: Fetch user profile server-side (token never leaves server) ──
    const userRes = await fetch(`https://${domain}/userinfo`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const user = await userRes.json();

    // ── Step 3: Set the access token as an httpOnly cookie ─────────
    const maxAge = tokenData.expires_in || 3600;
    res.setHeader(
      "Set-Cookie",
      `auth_token=${accessToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`
    );

    // Frontend only ever sees the user profile — never the raw token
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ error: "server_error", error_description: err.message });
  }
}
