import { CheckCircle, Users, BarChart3, Bell } from "lucide-react";
import { motion } from "framer-motion";

export function Features() {
  const features = [
    {
      icon: CheckCircle,
      title: "Task Management",
      description:
        "Create, assign, and track tasks with intuitive boards and timelines that keep everyone aligned.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Real-time collaboration features that bring your team closer, no matter where they are.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Gain insights into team productivity with detailed reports and performance metrics.",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Stay informed with intelligent notifications that keep you updated without noise.",
    },
  ];

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      id="features"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-secondary/5 to-transparent scroll-smooth"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-800">
            Powerful Features for Modern Teams
          </h2>
          <p className="text-lg text-gray-800  text-balance max-w-2xl mx-auto">
            Everything you need to manage projects efficiently and keep your team synchronized.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-8"
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
                className="glass-light rounded-2xl p-8 hover-lift cursor-pointer group"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 rounded-lg  flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={24} className="text-black font-extrabold" />
                </div>
                <h3 className="text-xl text-gray-800  font-semibold mb-3 ">
                  {feature.title}
                </h3>
                <p className="text-gray-800  leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
