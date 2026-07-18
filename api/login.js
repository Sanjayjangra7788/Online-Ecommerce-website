// api/login.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    const rawDomain = process.env.AUTH0_DOMAIN || "";
    const rawClientId = process.env.AUTH0_CLIENT_ID || "";
    const targetUrl = `https://${rawDomain}/oauth/token`;
    console.log("DEBUG domain (escaped):", JSON.stringify(rawDomain));
    console.log("DEBUG domain length:", rawDomain.length, "expected: 33");
    console.log("DEBUG client_id (escaped):", JSON.stringify(rawClientId));
    console.log("DEBUG client_id length:", rawClientId.length, "expected: 32");

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "http://auth0.com/oauth/grant-type/password-realm",
        realm: "Username-Password-Authentication",
        username: email,
        password: password,
        client_id: process.env.AUTH0_CLIENT_ID,
        scope: "openid profile email",
      }),
    });

    const rawText = await response.text();
    console.log("DEBUG raw response:", rawText.slice(0, 300));

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      return res.status(502).json({
        error: "bad_upstream_response",
        error_description: rawText.slice(0, 200),
        debug_url: targetUrl,
      });
    }

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "server_error", error_description: err.message });
  }
}