import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

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

export function CTA() {
  const plans = [
    {
      name: "Free Plan",
      price: 0,
      desc: "Free for all right now.",
      features: [
        "Unlimited projects",
        "Real-time collaboration",
        "Task prioritization",
        "Email support",
      ],
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-white to-slate-100/60 py-16 sm:py-20 min-h-screen flex items-center overflow-hidden" id="pricing">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-slate-200/30 to-transparent rounded-full blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div className="text-center mb-16" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.p variants={itemVariants} className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-3">💰 Pricing</motion.p>
          <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-5xl font-black text-slate-900 mb-4 leading-tight">0 Dollar Right Now</motion.h2>
          <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg text-slate-600">Free for all right now.</motion.p>
        </motion.div>

        <motion.div className="mx-auto grid max-w-xl grid-cols-1 gap-8 w-full mb-16" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {plans.map((p, idx) => (
            <motion.div key={idx} variants={itemVariants} whileHover={{ y: -8 }} className="relative rounded-3xl border border-slate-200 bg-white p-10 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_24px_50px_rgba(15,23,42,0.12)]">
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{p.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{p.desc}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-black text-slate-900">$0</span>
                  <span className="text-slate-600">/mo</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                {p.features.map((f, i) => (
                  <motion.div key={i} className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <Check className="w-5 h-5 text-slate-700 shrink-0" />
                    <span className="text-slate-700">{f}</span>
                  </motion.div>
                ))}
              </div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/signup"
                  className="block w-full rounded-full bg-slate-900 py-3.5 text-center font-bold text-white transition-all duration-300 hover:bg-slate-800"
                >
                  Start Free Now
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="text-center" variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <p className="text-lg text-slate-600">✨ Join 50,000+ high-performance professionals who trust SyncFlow</p>
        </motion.div>
      </div>
    </section>
  );
}
