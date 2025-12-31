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
    <section
      id="Hero"
      className="relative min-h-screen flex items-center justify-center pt-30 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #dbeafe 0%, #e6d9ff 45%, #f5f3ff 100%)",
      }}
    >
      {/* Enhanced soft blur accents for more visible depth */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400 rounded-full filter blur-3xl opacity-25 -z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300 rounded-full filter blur-3xl opacity-15 -z-10"></div>

      <motion.div
        className="max-w-4xl mx-auto text-center z-10"
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
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6 leading-tight text-gray-800"
          variants={itemVariants}
        >
          Organize, Collaborate, and{" "}
          <span className="bg-gradient-to-r from-gray-600 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Deliver Faster
          </span>
        </motion.h1>

        <motion.p
          className="text-sm sm:text-xl text-gray-700 text-balance mb-8 max-w-2xl mx-auto leading-relaxed"
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
            size="large"
            variant="contained"
            sx={{
              backgroundColor: "#000000",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#1a1a1a",
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
              borderColor: "#374151",
              color: "#000000",
              "&:hover": {
                borderColor: "#1f2937",
                backgroundColor: "#f3f4f6",
              },
            }}
          >
            Watch Demo
          </Button>
        </motion.div>

        <motion.div
          className="relative mx-auto mt-12 max-w-3xl"
          variants={itemVariants}
        >
          <div className="glass-light rounded-2xl p-8 flex justify-center items-center sm:p-12">
            <div className="bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-50 rounded-xl w-full max-w-2xl h-68 sm:h-64 lg:h-96 flex items-center justify-center shadow-inner">
              <motion.div
                className="text-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="inline-block mb-4">
                  <Zap size={48} className="text-purple-500 mx-auto" />
                </div>
                <p className="text-gray-600">Dashboard Preview</p>
              </motion.div>
            </div>
          </div>
          <div className="absolute -bottom-4 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/60 to-transparent -z-10 blur-2xl"></div>
        </motion.div>
      </motion.div>
    </section>
  );
}