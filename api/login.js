export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

        const { email, password } = body;

        const response = await fetch(
            `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    grant_type: "http://auth0.com/oauth/grant-type/password-realm",
                    realm: "Username-Password-Authentication",
                    username: email,
                    password,
                    client_id: process.env.AUTH0_CLIENT_ID,
                    client_secret: process.env.AUTH0_CLIENT_SECRET,
                    scope: "openid profile email",
                }),
            }
        );

        const data = await response.json();

        return res.status(response.status).json(data);
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
}