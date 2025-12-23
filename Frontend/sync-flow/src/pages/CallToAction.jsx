import { ArrowRight, Earth } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@mui/material"

export function CTA() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 gradient-blur opacity-25 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 gradient-blur opacity-20 -z-10"></div>

      <motion.div
        className="max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Icon */}
        <motion.div className="inline-block mb-6" variants={itemVariants}>
          <div className="w-16 h-16  flex items-center justify-center">
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
              <Earth size={32} className="text-black" />
            </motion.div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-700" variants={itemVariants}>
          Ready to Transform Your Workflow?
        </motion.h2>

        {/* Subheading */}
        <motion.p
          className="text-lg text-gray-950 text-balance mb-8 max-w-2xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Start exploring TaskFlow today and see how it can revolutionize the way you manage your personal and
          professional projects.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4" variants={itemVariants}>
          <Button
            variant="outlined"
            sx={{
                    borderColor: "gray",
                    color: "black",
                    "&:hover": {
                      borderColor: "gray",
                    },
                  }}
          >
          Start Your Free Trial
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </motion.div>

        
      </motion.div>
    </section>
  )
}