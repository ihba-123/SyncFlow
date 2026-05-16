import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function Hero() {
  return (
    <header
      id="Hero"
      className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-slate-100 min-h-[100svh] flex items-start lg:items-center justify-center pt-32 sm:pt-36 lg:pt-16 pb-10"
    >
      <div className="absolute -top-20 -right-20 w-[900px] h-[900px] rounded-full bg-slate-200/35 blur-3xl -z-10 animate-pulse" />
      <div className="absolute -bottom-32 -left-32 w-[700px] h-[700px] rounded-full bg-slate-300/20 blur-3xl -z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 items-center" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div
            variants={itemVariants}
            className="text-center lg:text-left space-y-6"
          >
            <motion.div variants={itemVariants}>
              <p className="mb-4 inline-block rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-600 border border-slate-200">
                ✨ v2.0 Now Live
              </p>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
              Manage tasks faster,
              <span className="block text-slate-700">
                without switching tools
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
              SyncFlow brings your team, projects, and context together in one fast, minimalist interface. Built for high-performance teams who value focus.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-900/25 hover:bg-slate-800 transition-all duration-300"
                >
                  Get Started Free →
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/demo"
                  className="inline-flex items-center justify-center rounded-full border-2 border-slate-200 bg-white/80 backdrop-blur-sm px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-md hover:shadow-lg hover:border-slate-300 transition-all duration-300"
                >
                  View Demo
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-end">
            <motion.div
              className="w-full max-w-md lg:max-w-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src="/images/landing-mockup.png"
                alt="App preview"
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760"><rect width="100%" height="100%" fill="%23f8fafc"/><g fill="%23e6eef8"><rect x="40" y="40" width="1120" height="680" rx="20"/></g><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2398a2b3" font-size="28">App preview (add /public/images/landing-mockup.png)</text></svg>';
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
}