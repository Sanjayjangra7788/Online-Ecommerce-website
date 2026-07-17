import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginSuccess } from "../../features/auth/authSlice";
import { FaEye, FaEyeSlash, FaArrowRight, FaGoogle, FaGithub } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { auth0Config } from "../../auth/auth0Config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const DOMAIN   = auth0Config.domain;
const CLIENT_ID = auth0Config.clientId;

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  // ── LOGIN via Auth0 Resource Owner Password Grant ─────────────
  // const handleLogin = async () => {
  //   const res = await fetch(`https://${DOMAIN}/oauth/token`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       grant_type: "http://auth0.com/oauth/grant-type/password-realm",
  //       realm:      "Username-Password-Authentication",
  //       username:   email,
  //       password:   password,
  //       client_id:  CLIENT_ID,
  //       scope:      "openid profile email",
  //     }),
  //   });

  //   const data = await res.json();
  //   console.log("hdhdhhdhdhdhdhdd",data)

  //   if (!res.ok) {
  //     throw new Error(data.error_description || "Login failed");
  //   }

  //   // Access token se user info fetch karo
  //   const userRes = await fetch(`https://${DOMAIN}/userinfo`, {
  //     headers: { Authorization: `Bearer ${data.access_token}` },
  //   });
  //   const userInfo = await userRes.json();

  //   dispatch(loginSuccess({
  //     token: data.access_token,
  //     user: {
  //       id:      userInfo.sub,
  //       name:    userInfo.name,
  //       email:   userInfo.email,
  //       picture: userInfo.picture,
  //     },
  //   }));

  //   navigate("/");
  // };

  const handleLogin = async () => {
  const credential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = credential.user;

  dispatch(
    loginSuccess({
      token: await user.getIdToken(),
      user: {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        picture: user.photoURL,
      },
    })
  );

  navigate("/");
};

  // ── REGISTER via Auth0 Database Signup API ────────────────────
  const handleRegister = async () => {
    const res = await fetch(`https://${DOMAIN}/dbconnections/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id:  CLIENT_ID,
        connection: "Username-Password-Authentication",
        email:      email,
        password:   password,
        name:       name,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.description ||
        data.message     ||
        "Registration failed"
      );
    }

    // Register ke baad auto login
    await handleLogin();
  };

  // ── Form Submit ───────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await handleRegister();
      } else {
        await handleLogin();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Social Login (Google / GitHub) ───────────────────────────
  // Social ke liye Auth0 redirect zaroori hai (OAuth protocol)
  const handleSocial = (connection) => {
    const params = new URLSearchParams({
      response_type: "token",
      client_id:     CLIENT_ID,
      redirect_uri:  window.location.origin + "/login",
      connection,
      scope:         "openid profile email",
    });
    window.location.href = `https://${DOMAIN}/authorize?${params}`;
  };

  // ── Handle Social Callback (hash mein token aata hai) ─────────
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("access_token")) return;

    const params = new URLSearchParams(hash.replace("#", ""));
    const token  = params.get("access_token");
    if (!token) return;

    // User info fetch karo token se
    fetch(`https://${DOMAIN}/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((userInfo) => {
        dispatch(loginSuccess({
          token,
          user: {
            id:      userInfo.sub,
            name:    userInfo.name,
            email:   userInfo.email,
            picture: userInfo.picture,
          },
        }));
        window.history.replaceState({}, document.title, "/");
        navigate("/");
      })
      .catch(() => setError("Social login failed. Please try again."));
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-[440px]">

        {/* ── Logo ────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block">
            <h1 className="font-display font-bold" style={{ fontSize: "40px" }}>
              <span style={{ color: "var(--ink)" }}>San</span>
              <span style={{ color: "var(--gold)" }}>Vora</span>
            </h1>
          </Link>
          <p className="mt-2 text-[14px]" style={{ color: "var(--muted)" }}>
            {isRegister ? "Create your account" : "Sign in to your account"}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-3xl shadow-xl"
          style={{ background: "white", border: "1px solid var(--border)" }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name field — sirf Register mein dikhega */}
            <AnimatePresence>
              {isRegister && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <label className="block text-[13px] font-semibold mb-2" style={{ color: "var(--ink)" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isRegister}
                    className="w-full h-[50px] px-5 rounded-xl text-[14px] transition"
                    style={{ background: "var(--cream)", border: "1px solid var(--border)", color: "var(--ink)" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label className="block text-[13px] font-semibold mb-2" style={{ color: "var(--ink)" }}>
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-[50px] px-5 rounded-xl text-[14px] transition"
                style={{ background: "var(--cream)", border: "1px solid var(--border)", color: "var(--ink)" }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[13px] font-semibold mb-2" style={{ color: "var(--ink)" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-[50px] px-5 pr-12 rounded-xl text-[14px] transition"
                  style={{ background: "var(--cream)", border: "1px solid var(--border)", color: "var(--ink)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--muted)" }}
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[13px] px-4 py-3 rounded-xl"
                  style={{ background: "#FFF0F0", color: "var(--red)" }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit Button — original style */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] rounded-full font-semibold text-[14px] flex items-center justify-center gap-3 transition hover:opacity-90 hover:shadow-lg disabled:opacity-60"
              style={{ background: "var(--ink)", color: "white" }}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? "Create Account" : "Sign In"}</span>
                  <FaArrowRight className="text-[12px]" />
                </>
              )}
            </button>
          </form>

          {/* ── Divider ─────────────────────────────────────── */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-[12px]" style={{ color: "var(--muted)" }}>or continue with</span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          {/* ── Social Buttons ───────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocial("google-oauth2")}
              className="h-[46px] rounded-xl flex items-center justify-center gap-2 font-medium text-[13px] transition hover:shadow-md"
              style={{ border: "1px solid var(--border)", background: "var(--cream)", color: "var(--ink)" }}
            >
              <FaGoogle style={{ color: "#DB4437" }} />
              <span>Google</span>
            </button>
            <button
              onClick={() => handleSocial("github")}
              className="h-[46px] rounded-xl flex items-center justify-center gap-2 font-medium text-[13px] transition hover:shadow-md"
              style={{ border: "1px solid var(--border)", background: "var(--cream)", color: "var(--ink)" }}
            >
              <FaGithub />
              <span>GitHub</span>
            </button>
          </div>

          {/* Auth0 secured badge */}
          <div
            className="mt-5 p-4 rounded-xl"
            style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}
          >
            <p className="text-[12px]" style={{ color: "var(--muted)" }}>
              🔐 Secured by{" "}
              <strong style={{ color: "var(--gold)" }}>Auth0</strong>
              {" "}— enterprise-grade authentication
            </p>
          </div>
        </motion.div>

        {/* ── Toggle Login / Register ──────────────────────── */}
        <p className="text-center mt-6 text-[13px]" style={{ color: "var(--muted)" }}>
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <span
            onClick={() => { setIsRegister(!isRegister); setError(""); }}
            className="font-semibold cursor-pointer hover:opacity-60 transition"
            style={{ color: "var(--ink)" }}
          >
            {isRegister ? "Sign In" : "Create one"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;

