import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  IconButton,
  Button,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Registration } from "../../api/auth";
import { toast } from "react-toastify";


// Motion wrapper for staggered animations
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
    password2: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: Registration,
    onSuccess: () => {
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    },
   onError: (error) => {
  const data = error.response?.data;
  let message = "Registration failed. Please try again."; 

  if (data) {
    if (data.email) message = data.email[0];
    else if (data.name) message = data.name[0]; 
    else if (data.username) message = data.username[0];
    else if (data.password) message = data.password[0];
    else if (data.password2) message = data.password2[0];
    else if (typeof data === "string") message = data;
  }

  toast.error(message); 
},

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      return;
    }


    if (formData.password !== formData.password2) {
      toast.error("Passwords do not match.");
      return;
    }

    registerMutation.mutate(formData);
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center py-12 px-4">
      {/* Background Blobs */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute w-72 h-72 bg-gray-200/25 rounded-full blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-72 h-72 bg-gray-300/20 rounded-full blur-3xl -bottom-20 -right-20"></div>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
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
            {/* Full Name */}
            <MotionItem delay={1}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                required
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
                required
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
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} className="text-gray-500" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
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
                name="password2"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.password2}
                onChange={handleChange}
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} className="text-gray-500" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MotionItem>

            {/* Terms */}
            <MotionItem delay={5}>
              <FormControlLabel
                control={<Checkbox required />}
                label={
                  <span className="text-sm text-gray-700">
                    I agree to the{" "}
                    <a href="#" className="underline hover:text-gray-900">
                      Terms
                    </a>{" "}
                    &{" "}
                    <a href="#" className="underline hover:text-gray-900">
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
                disabled={registerMutation.isPending}
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
                {registerMutation.isPending ? (
                  <>
                    <CircularProgress size={20} sx={{ color: "white", mr: 1 }}  />
                  </>
                ) : (
                  <>  
                    Sign Up <ArrowRight size={20} style={{ marginLeft: 8 }} />
                  </>
                )}
              </Button>
            </MotionItem>
          </form>

          <MotionItem delay={7}>
            <p className="text-center text-sm text-gray-600 mt-8">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-gray-900 underline hover:text-black">
                Sign in
              </Link>
            </p>
          </MotionItem>
        </div>
      </motion.div>
    </div>
  );
}