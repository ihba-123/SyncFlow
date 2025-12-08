import React from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@mui/material";

export default function Hero() {
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
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section id="Hero" className="relative min-h-screen flex items-center justify-center pt-30 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 gradient-blur opacity-30 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 gradient-blur opacity-20 -z-10 delay-1000"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-accent/5 -z-10"></div>

      <motion.div
        className="max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-8 w-fit mx-auto"
          variants={itemVariants}
        >
          <Zap size={16} className="text-yellow-500" />
          <span className="text-sm text-gray-700">
            Now available for your personal projects
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl text-gray-800  lg:text-6xl font-bold text-balance mb-6 leading-tight"
          variants={itemVariants}
        >
          Organize, Collaborate, and{" "}
          <span className="bg-gradient-to-r from-gray-500  via-gray-700
           to-gray-700 bg-clip-text text-transparent">
            Deliver Faster
          </span>
        </motion.h1>

        <motion.p
          className="text-sm sm:text-xl text-foreground/70 text-balance mb-8 max-w-2xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          SyncFlow is the modern project management platform that brings clarity
          to confusion. Streamline workflows, boost team collaboration, and achieve
          your goals effortlessly.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          variants={itemVariants}
        >
          <Button
            size="lg"
            variant="contained"
            sx={{
                    borderColor: "white",
                    backgroundColor: "black",
                    color: "white",
                    "&:hover": {
                      borderColor: "gray",
                    },
                  }}
          >
            Get Started Free
            <ArrowRight size={18} className="ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outlined"
            sx={{
                    borderColor: "gray",
                    color: "black",
                    "&:hover": {
                      borderColor: "gray",
                    },
                  }}
          >
            Watch Demo
          </Button>
        </motion.div>

        <motion.div
          className="relative mx-auto mt-12 max-w-3xl  "
          variants={itemVariants}
        >
          <div className="glass-light rounded-2xl p-8 flex justify-center items-center sm:p-12">
            <div className="bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 rounded-xl w-86 lg:w-full h-68 sm:h-64 lg:h-90 flex items-center justify-center">
              <motion.div
                className="text-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="inline-block mb-4 ">
                  <Zap size={48} className="text-accent/60 mx-auto" />
                </div>
                <p className="text-foreground/50">Dashboard Preview</p>
              </motion.div>
            </div>
          </div>
          <div className="absolute -bottom-4 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/50 to-transparent -z-10 blur-2xl"></div>
        </motion.div>
      </motion.div>
    </section>
  );
}
