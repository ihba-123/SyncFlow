import { Sparkles, Home, Workflow } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function Features() {
  const features = [
    {
      icon: Sparkles,
      title: "Task Syncing",
      description: "Synchronized tasks across all devices and team members.",
    },
    {
      icon: Home,
      title: "Real-time Collaboration",
      description: "See cursors, comments, and changes as your team builds together.",
    },
    {
      icon: Workflow,
      title: "Smart Prioritization",
      description: "Advanced scheduling that keeps the most important work on top.",
    },
  ];

  return (
    <section id="features" className="relative bg-gradient-to-b from-white to-slate-100/60 py-16 sm:py-20 min-h-screen flex items-center overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-slate-200/40 to-transparent rounded-full blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div className="text-center mb-16" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.p variants={itemVariants} className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-3">✨ Feature Highlights</motion.p>
          <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-5xl font-black text-slate-900 mb-4 leading-tight">Engineered for speed</motion.h2>
          <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg text-slate-600">Everything you need to keep your workflow synchronized.</motion.p>
        </motion.div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_30px_60px_rgba(15,23,42,0.12)] transition-all duration-300 hover:border-slate-300"
              >
                <motion.div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-500 text-white mb-6 group-hover:scale-110 transition-transform duration-300" animate={{ rotate: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                  <Icon size={20} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-base text-slate-600 leading-relaxed">{f.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}