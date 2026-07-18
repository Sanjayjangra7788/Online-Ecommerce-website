
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { auth0Config } from "../../auth/auth0Config";

const DOMAIN = auth0Config.domain;
const CLIENT_ID = auth0Config.clientId;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`https://${DOMAIN}/dbconnections/change_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          email: email,
          connection: "Username-Password-Authentication",
        }),
      });

  
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error_description || data.message || "Something went wrong. Try again.");
      }

      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-[440px]">


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-3xl shadow-xl"
          style={{ background: "white", border: "1px solid var(--border)" }}
        >
              <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h2 className="font-display font-bold" style={{ fontSize: "40px" }}>
              <span style={{ color: "var(--ink)" }}>San</span>
              <span style={{ color: "var(--gold)" }}>Vora</span>
            </h2>
          </Link>
          <p className="mt-2 text-[14px]" style={{ color: "var(--muted)" }}>
            Reset your password
          </p>
        </div>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-6"
              >
                <FaCheckCircle className="mx-auto mb-4 text-[40px]" style={{ color: "var(--gold)" }} />
                <h3 className="font-semibold text-[16px] mb-2" style={{ color: "var(--ink)" }}>
                  Check your inbox
                </h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
                  If an account exists for <strong>{email}</strong> we've sent a password reset link to that address...
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 mt-6 text-[13px] font-semibold hover:opacity-60 transition"
                  style={{ color: "var(--ink)" }}
                >
                  <FaArrowLeft className="text-[11px]" />
                  Back to Sign In
                </Link>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
                  Enter your registered email and we'll send you a link to reset your password.
                </p>

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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[52px] rounded-full font-semibold text-[14px] flex items-center justify-center gap-3 transition hover:opacity-90 hover:shadow-lg disabled:opacity-60"
                  style={{ background: "var(--ink)", color: "white" }}
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>

                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 text-[13px] font-medium hover:opacity-60 transition"
                  style={{ color: "var(--muted)" }}
                >
                  <FaArrowLeft className="text-[11px]" />
                  Back to Sign In
                </Link>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default ForgotPassword;
