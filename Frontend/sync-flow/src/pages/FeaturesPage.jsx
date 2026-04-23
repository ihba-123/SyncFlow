import { CheckCircle2, Users, BarChart3, Bot, Clock3, FolderKanban } from "lucide-react";
import { motion } from "framer-motion";

export function Features() {
  const features = [
    {
      icon: CheckCircle2,
      title: "Task Management",
      description: "Organize tasks in focused boards.",
      preview: "/images/task-management.png",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Collaborate with comments and mentions.",
      preview: "/images/team-collaboration.png",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track output with live metrics.",
      preview: "/images/analytics-dashboard.png",
    },
    {
      icon: Bot,
      title: "Automation Workflow",
      description: "Automate repetitive team routines.",
      preview: "/images/automation-workflow.png",
    },
    {
      icon: Clock3,
      title: "Time Tracking",
      description: "Log effort and compare delivery speed.",
      preview: "/images/time-tracking.png",
    },
    {
      icon: FolderKanban,
      title: "File Sharing",
      description: "Share assets safely across projects.",
      preview: "/images/file-sharing.png",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-white px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-12 top-12 h-36 w-36 rounded-full bg-blue-100/80 blur-3xl" />
        <div className="absolute bottom-8 right-8 h-44 w-44 rounded-full bg-indigo-100/70 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">
            Feature Highlights
          </p>
          <h2 className="mb-3 text-xl font-semibold text-slate-900 sm:text-2xl lg:text-3xl">
            Everything your team needs
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base">
            A modern toolkit for planning, execution, and collaboration.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.015 }}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgb(15,23,42,0.06)] transition-all hover:shadow-[0_14px_34px_rgb(15,23,42,0.1)]"
              >
                <div className="relative h-36 overflow-hidden bg-slate-50">
                  <motion.img
                    src={feature.preview}
                    alt={`${feature.title} preview`}
                    className="h-full w-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <div className="p-4 sm:p-5">
                  <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
                    <Icon size={16} />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold text-slate-900 sm:text-base">{feature.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}