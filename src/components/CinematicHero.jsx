
import { motion } from "framer-motion";

export default function CinematicHero() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/10 to-blue-500/20 blur-3xl"></div>

      <motion.div
        animate={{ scale: [1,1.05,1], rotate:[0,1,0] }}
        transition={{ duration:10, repeat:Infinity }}
        className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity:0, y:120 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:1 }}
        >
          <p className="uppercase tracking-[8px] text-purple-400 mb-6">
            Apple Style UI
          </p>

          <h1 className="text-7xl md:text-8xl font-black leading-none">
            Cinematic
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              {" "}Shopping
            </span>
          </h1>

          <p className="text-slate-400 mt-8 text-xl leading-9">
            Ultra smooth animations and premium ecommerce experience.
          </p>

          <div className="flex gap-5 mt-10">
            <motion.button
              whileHover={{ scale:1.08, y:-5 }}
              className="gradient-bg px-8 py-5 rounded-2xl font-bold"
            >
              Explore
            </motion.button>

            <motion.button
              whileHover={{ scale:1.05 }}
              className="glass px-8 py-5 rounded-2xl font-bold"
            >
              Watch Demo
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity:0, x:120 }}
          animate={{ opacity:1, x:0 }}
          transition={{ duration:1 }}
        >
          <motion.img
            animate={{ y:[0,-20,0] }}
            transition={{ duration:5, repeat:Infinity }}
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200"
            className="rounded-[50px] shadow-[0_40px_100px_rgba(139,92,246,0.35)]"
          />
        </motion.div>
      </div>
    </section>
  );
}
