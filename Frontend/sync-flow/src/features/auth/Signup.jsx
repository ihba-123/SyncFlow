import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

// Motion wrapper (defined outside so it doesn't recreate every render)
const MotionItem = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.1, duration: 0.5, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fix input lag: simple change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsLoading(false);
  };

  return (
    <div className="relative w-full">

      {/* SAFE STATIC BACKGROUND (no animation to avoid reflow lag) */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute w-72 h-72 bg-gray-200/25 rounded-full blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-72 h-72 bg-gray-300/20 rounded-full blur-3xl -bottom-20 -right-20"></div>
      </div>

      {/* Main container */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-auto"
      >
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
          
          <MotionItem delay={0}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Create Your Account
              </h2>
              <p className="mt-2 text-gray-600">Start managing projects today</p>
            </div>
          </MotionItem>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <MotionItem delay={1}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={20} className="text-gray-500" />
                    </InputAdornment>
                  ),
                }}
              />
            </MotionItem>

            {/* Email */}
            <MotionItem delay={2}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={20} className="text-gray-500" />
                    </InputAdornment>
                  ),
                }}
              />
            </MotionItem>

            {/* Password */}
            <MotionItem delay={3}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} className="text-gray-500" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MotionItem>

            {/* Confirm Password */}
            <MotionItem delay={4}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} className="text-gray-500" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MotionItem>

            {/* Terms Checkbox */}
            <MotionItem delay={5}>
              <FormControlLabel
                control={<Checkbox required />}
                label={
                  <span className="text-sm text-gray-700">
                    I agree to the{" "}
                    <a href="#" className="underline">
                      Terms
                    </a>{" "}
                    &{" "}
                    <a href="#" className="underline">
                      Privacy Policy
                    </a>
                  </span>
                }
              />
            </MotionItem>

            {/* Submit Button */}
            <MotionItem delay={6}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  mt: 1,
                  py: 1.8,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  background: "linear-gradient(to right, #1f2937, #000000)",
                  "&:hover": {
                    background: "linear-gradient(to right, #374151, #111111)",
                  },
                }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign Up <ArrowRight size={20} />
                  </span>
                )}
              </Button>
            </MotionItem>
          </form>

          <MotionItem delay={7}>
            <p className="text-center text-sm text-gray-600 mt-8">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-gray-900 underline">
                Sign in
              </Link>
            </p>
          </MotionItem>
        </div>
      </motion.div>
    </div>
  );
}
