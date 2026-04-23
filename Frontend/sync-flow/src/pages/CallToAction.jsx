import { ArrowRight, PlayCircle, Bell, ListTodo, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export function CTA() {
  const floatingCards = [
    {
      title: "Tasks Done",
      value: "142",
      icon: ListTodo,
      className: "-left-6 top-20 sm:-left-14",
    },
    {
      title: "New Alerts",
      value: "08",
      icon: Bell,
      className: "right-0 top-8 sm:-right-10",
    },
    {
      title: "Weekly Growth",
      value: "+28%",
      icon: TrendingUp,
      className: "-bottom-4 right-14 sm:right-24",
    },
  ];

  return (
    <section
      id="pricing"
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 18% 25%, #dbeafe 0%, transparent 36%), radial-gradient(circle at 80% 15%, #ddd6fe 0%, transparent 34%), linear-gradient(140deg, #f8fbff 0%, #f5f6ff 44%, #eef3ff 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-12 h-44 w-44 -translate-x-1/2 rounded-full bg-blue-300/35 blur-3xl" />
        <div className="absolute bottom-10 right-8 h-52 w-52 rounded-full bg-indigo-300/30 blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 mx-auto max-w-6xl rounded-3xl border border-white/70 bg-white/65 p-6 shadow-[0_30px_80px_rgb(15,23,42,0.12)] backdrop-blur-xl sm:p-10"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
      >
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <motion.p
              className="mb-4 inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, duration: 0.4 }}
              viewport={{ once: true }}
            >
              Launch Faster
            </motion.p>

            <motion.h2
              className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl lg:text-4xl"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.45 }}
              viewport={{ once: true }}
            >
              Build your next project
              <span className="block bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                with momentum from day one.
              </span>
            </motion.h2>

            <motion.p
              className="mx-auto mt-5 max-w-xl text-sm sm:text-base text-slate-600 lg:mx-0"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.45 }}
              viewport={{ once: true }}
            >
              Plan, prioritize, and ship in one elegant workspace. SyncFlow helps teams stay aligned, move faster, and deliver quality outcomes.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.45 }}
              viewport={{ once: true }}
            >
              <Button
                size="large"
                component={Link}
                to="/login"
                variant="contained"
                sx={{
                  borderRadius: "999px",
                  px: 3,
                  py: 1.3,
                  background: "linear-gradient(90deg, #2563eb, #4f46e5)",
                  boxShadow: "0 12px 30px rgba(37, 99, 235, 0.34)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #1d4ed8, #4338ca)",
                  },
                }}
              >
                Get Started Free
                <ArrowRight size={18} className="ml-2" />
              </Button>

              <Button
                size="large"
                variant="outlined"
                sx={{
                  borderRadius: "999px",
                  px: 3,
                  py: 1.3,
                  borderColor: "#94a3b8",
                  color: "#0f172a",
                  "&:hover": {
                    borderColor: "#334155",
                    backgroundColor: "#f8fafc",
                  },
                }}
              >
                <PlayCircle size={18} className="mr-2" />
                Watch Demo
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
          >
            <motion.img
              src="https://dummyimage.com/1200x760/1e293b/ffffff.png&text=SyncFlow+Dashboard+Preview"
              alt="Dashboard mockup"
              className="w-full rounded-2xl border border-white/70 object-cover shadow-[0_25px_60px_rgb(15,23,42,0.2)]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            {floatingCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  className={`absolute ${card.className} rounded-xl border border-white/80 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md`}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.2 + idx, repeat: Infinity, ease: "easeInOut" }}
                >
                  <p className="text-[11px] font-medium text-slate-500">{card.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Icon size={14} className="text-blue-600" />
                    <span className="text-sm font-semibold text-slate-800">{card.value}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}