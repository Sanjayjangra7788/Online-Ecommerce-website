
import { motion } from "framer-motion";
import { Home, ShoppingBag, LayoutDashboard, MessageCircle } from "lucide-react";

export default function AnimatedSidebar() {
  return (
    <motion.div
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 glass p-4 rounded-3xl z-50 hidden lg:flex flex-col gap-5"
    >
      {[Home, ShoppingBag, LayoutDashboard, MessageCircle].map((Icon, i) => (
        <button
          key={i}
          className="p-4 rounded-2xl hover:bg-white/10 transition"
        >
          <Icon />
        </button>
      ))}
    </motion.div>
  );
}
