import { motion } from "framer-motion";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Your Workspace",
      description:
        "Set up your first project and invite team members to collaborate in seconds.",
    },
    
    {
      number: "02",
      title: "Organize Tasks",
      description:
        "Break down projects into tasks, set priorities, and assign them to team members.",
    },
    {
      number: "03",
      title: "Collaborate in Real-Time",
      description:
        "Work together with built-in comments, file sharing, and activity tracking.",
    },
    {
      number: "04",
      title: "Track Progress",
      description:
        "Monitor project health with dashboards and analytics that drive accountability.",
    },
    {
      number: "05",
      title: "Deliver Results",
      description:
        "Celebrate wins and continuously improve with insights from completed projects.",
    },
  ];

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <section
      id="how-it-works"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-accent/5 via-transparent to-primary/5"
    >
      <div className="max-w-7xl mx-auto ">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-700">
            Simple Workflow, Powerful Results
          </h2>
          <p className="text-lg text-gray-800  text-balance max-w-2xl mx-auto">
            Get started in minutes and see the difference TaskFlow makes in your
            team's productivity.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Desktop Timeline */}
          <div className="hidden md:block">
            <div className="flex flex-col gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex gap-8 items-start"
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  variants={itemVariants}
                  viewport={{ once: true }}
                >
                  {index % 2 === 0 ? (
                    <>
                      {/* Left side content */}
                      <div className="flex-1 text-right">
                        <div className="glass-light rounded-xl p-6 text-right">
                          <h3 className="text-xl font-semibold mb-2 text-gray-950 ">
                            {step.title}
                          </h3>
                          <p className="text-gray-800 ">{step.description}</p>
                        </div>
                      </div>

                      {/* Center line & number */}
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-black flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {step.number}
                        </div>
                        {index < steps.length - 1 && (
                          <div className="w-1 h-16 bg-gradient-to-b from-gray-900 to-gray-400 mt-4"></div>
                        )}
                      </div>

                      <div className="flex-1"></div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1"></div>

                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-black to-gray-300 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {step.number}
                        </div>
                        {index < steps.length - 1 && (
                          <div className="w-1 h-16 bg-gradient-to-b from-gray-400 to-gray-900 mt-4"></div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="glass-light rounded-xl p-6">
                          <h3 className="text-xl font-semibold mb-2 text-gray-950">
                            {step.title}
                          </h3>
                          <p className="text-gray-800">{step.description}</p>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="md:hidden flex flex-col gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex gap-4"
                custom={index}
                initial="hidden"
                whileInView="visible"
                variants={itemVariants}
                viewport={{ once: true }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-black flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-1 h-12 bg-gradient-to-b  from-gray-400 to-gray-900 mt-2"></div>
                  )}
                </div>

                <div className="glass-light rounded-xl p-4 flex-1 pb-6">
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-foreground/70 text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
