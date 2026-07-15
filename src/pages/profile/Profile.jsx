import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaShieldAlt, FaClipboardList, FaHeart, FaChevronRight, FaCog } from "react-icons/fa";
import { motion } from "framer-motion";

function Profile() {
  const user = useSelector((state) => state.auth?.user);
  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const wishlistItems = useSelector((state) => state.wishlist?.wishlistItems || []);
  const orders = useSelector((state) => state.order?.orders || []);

  const MENU_ITEMS = [
    { icon: FaClipboardList, label: "My Orders", desc: "View & track your orders", link: "/orders" },
    { icon: FaHeart, label: "Wishlist", desc: `${wishlistItems.length} saved items`, link: "/wishlist" },
    { icon: FaShieldAlt, label: "Security", desc: "Password & 2FA settings", link: "#" },
    { icon: FaCog, label: "Preferences", desc: "Notification & display settings", link: "#" },
  ];

  return (
    <div className="fade-up max-w-[720px] mx-auto">
      <div className="mb-10">
        <p className="text-[12px] tracking-widest uppercase font-semibold mb-2" style={{ color: "var(--gold)" }}>Account</p>
        <h1 className="font-display font-semibold" style={{ fontSize: "clamp(32px,4vw,48px)", color: "var(--ink)" }}>My Profile</h1>
      </div>

      {/* Profile card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-3xl mb-6" style={{ background: "white", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-[28px] font-bold"
            style={{ background: "var(--gold)" }}>
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-[22px]" style={{ color: "var(--ink)" }}>{user?.name || "Guest User"}</h2>
            <p className="flex items-center gap-2 text-[14px] mt-1" style={{ color: "var(--muted)" }}>
              <FaEnvelope className="text-[12px]" /> {user?.email || "Not signed in"}
            </p>
            {user?.role && (
              <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-[11px] font-semibold capitalize"
                style={{ background: "rgba(201,168,76,0.1)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.2)" }}>
                {user.role}
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
          {[
            ["Cart Items", cartItems.reduce((a, i) => a + i.quantity, 0)],
            ["Wishlist", wishlistItems.length],
            ["Orders", orders.length],
          ].map(([label, val]) => (
            <div key={label} className="text-center">
              <p className="font-bold text-[28px]" style={{ color: "var(--ink)" }}>{val}</p>
              <p className="text-[12px] mt-0.5" style={{ color: "var(--muted)" }}>{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Menu */}
      <div className="space-y-3">
        {MENU_ITEMS.map(({ icon: Icon, label, desc, link }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Link to={link}
              className="flex items-center gap-4 p-5 rounded-2xl transition hover:shadow-md"
              style={{ background: "white", border: "1px solid var(--border)" }}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: "rgba(201,168,76,0.08)" }}>
                <Icon className="text-[15px]" style={{ color: "var(--gold)" }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[14px]" style={{ color: "var(--ink)" }}>{label}</p>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--muted)" }}>{desc}</p>
              </div>
              <FaChevronRight className="text-[11px]" style={{ color: "var(--border)" }} />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
