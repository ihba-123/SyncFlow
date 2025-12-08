import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const motionDiv = (children, i) => (
    <motion.div
      custom={i}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="relative w-full flex justify-center items-center">
      {/* Background Blobs */}
      <motion.div
        className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-br from-gray-200/30 to-gray-100/30 rounded-full blur-3xl"
        animate={{ x: [0, 50, -50, 0], y: [0, 30, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{ top: "-10%", left: "-10%" }}
      />
      <motion.div
        className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-br from-gray-300/20 to-gray-200/20 rounded-full blur-3xl"
        animate={{ x: [0, -50, 50, 0], y: [0, -30, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{ bottom: "-10%", right: "-10%" }}
      />

      <motion.div
        className="w-full max-w-md sm:max-w-lg lg:max-w-xl z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }}
      >
        <div className="backdrop-blur-xl bg-white/80 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Header */}
          {motionDiv(
            <div className="mb-6 sm:mb-8 flex flex-col items-center justify-center text-center sm:text-left">
              <div className="flex items-center justify-center  sm:justify-start gap-3 mb-2">
                
                <h1 className="text-2xl sm:text-3xl  font-bold text-gray-900">Welcome Back</h1>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">
                Sign in to your SyncFlow account
              </p>
            </div>,
            0
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {motionDiv(
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={18} className="text-gray-500" />
                    </InputAdornment>
                  ),
                }}
              />,
              1
            )}

            {motionDiv(
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={18} className="text-gray-500" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />,
              2
            )}

            {motionDiv(
              <div className="flex flex-col sm:flex-row items-center justify-between items-start text-sm">
                <FormControlLabel control={<Checkbox />} label="Remember me" />
              </div>,
              3
            )}

            {motionDiv(
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  background: "linear-gradient(to right, #1f2937, #000)",
                  py: "10px",
                  borderRadius: "8px",
                  "&:hover": {
                    background: "linear-gradient(to right, #374151, #111)",
                  },
                }}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    &nbsp;Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight size={16} />
                  </>
                )}
              </Button>,
              4
            )}
          </form>

          {motionDiv(
            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-gray-900 font-semibold hover:underline">
                Sign up
              </Link>
            </p>,
            5
          )}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center text-xs text-gray-500 mt-6 sm:mt-8"
        >
          &copy; {new Date().getFullYear()} SyncFlow. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
}
