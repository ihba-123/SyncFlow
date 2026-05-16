import { motion } from "framer-motion";

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function HowItWorks() {
  const steps = [
    {
      title: "Create project",
      desc: "Set up boards, invite teammates and configure workflows.",
      icon: "📋",
    },
    {
      title: "Add tasks",
      desc: "Break work into focused tasks and assign owners.",
      icon: "✅",
    },
    {
      title: "Prioritize",
      desc: "Use smart prioritization to keep important work on top.",
      icon: "⭐",
    },
    {
      title: "Ship",
      desc: "Track progress and deliver faster with clear context.",
      icon: "🚀",
    },
  ];

  return (
    <section id="how-it-works" className="relative bg-gradient-to-b from-slate-100/60 to-white py-16 sm:py-20 min-h-screen flex items-center overflow-hidden">
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-slate-200/30 to-transparent rounded-full blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div className="text-center mb-16" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.p variants={itemVariants} className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-3">📍 How it works</motion.p>
          <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-5xl font-black text-slate-900 mb-4 leading-tight">A simple flow your team can follow</motion.h2>
          <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg text-slate-600">Four clear steps from setup to execution.</motion.p>
        </motion.div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full relative" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent -translate-y-1/2 hidden lg:block -z-10" />
          {steps.map((s, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-200/0 to-slate-200/0 group-hover:from-slate-200/20 group-hover:to-slate-200/20 rounded-3xl blur-xl transition-all duration-300 -z-10" />
              
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-[0_10px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)] transition-all duration-300 hover:border-slate-300">
                <motion.div className="text-5xl mb-4" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  {s.icon}
                </motion.div>
                <div className="mx-auto h-12 w-12 mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-500 text-white font-bold text-lg">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h3>
                <p className="text-base text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}