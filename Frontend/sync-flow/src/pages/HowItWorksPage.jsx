import { motion } from "framer-motion";

export function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Create Project",
      description: "Set goals and launch your workspace instantly.",
      image: "/images/create-project.png",
    },
    {
      number: 2,
      title: "Add Tasks",
      description: "Break work into small, focused action items.",
      image: "/images/add-tasks.png",
    },
    {
      number: 3,
      title: "Assign Team Members",
      description: "Assign owners and align everyone clearly.",
      image: "/images/assign-team-members.png",
    },
    {
      number: 4,
      title: "Track Progress",
      description: "Follow delivery with live progress insights.",
      image: "/images/track-progress.png",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    }),
  };

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-white px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-8 top-16 h-36 w-36 rounded-full bg-indigo-100/65 blur-3xl" />
        <div className="absolute bottom-12 right-8 h-44 w-44 rounded-full bg-blue-100/65 blur-3xl" />
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
            How It Works
          </p>
          <h2 className="mb-3 text-xl font-semibold text-slate-900 sm:text-2xl lg:text-3xl">
            A simple flow your team can follow
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base">
            Four clear steps from setup to execution.
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-6xl space-y-6 sm:space-y-8">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-linear-to-b from-transparent via-blue-200 to-transparent lg:block" />

          {steps.map((step, index) => {
            const textFirst = index % 2 === 0;

            return (
              <motion.article
                key={step.number}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid items-center gap-5 lg:grid-cols-2 lg:gap-8"
              >
                <div className={textFirst ? "lg:order-1" : "lg:order-2"}>
                  <motion.div
                    className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_26px_rgb(15,23,42,0.07)] sm:p-6"
                    initial={{ opacity: 0, x: textFirst ? -18 : 18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45 }}
                    viewport={{ once: true }}
                  >
                    <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white shadow-sm">
                      {step.number}
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 sm:text-lg">{step.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{step.description}</p>
                  </motion.div>
                </div>

                <div className={textFirst ? "lg:order-2" : "lg:order-1"}>
                  <motion.div
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_26px_rgb(15,23,42,0.07)]"
                    initial={{ opacity: 0, x: textFirst ? 18 : -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45 }}
                    viewport={{ once: true }}
                  >
                    <motion.img
                      src={step.image}
                      alt={step.title}
                      className="h-52 w-full object-cover sm:h-64"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}