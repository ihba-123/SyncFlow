import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Checkbox from "@mui/material/Checkbox";
import { FormControlLabel, CircularProgress } from "@mui/material";
import { login } from "../../api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess:  (res) => {
      navigate("/dashboard");
      toast.success("Login Successful");
    },

    onError: (error) => {
      const data = error.response?.data;
      let message = "Login failed. Please try again.";
      if (data) {
        if (data.email) message = data.email[0];
        else if (data.password) message = data.password[0];
        else if (typeof data === "string") message = data;
      }
      toast.error(message);
    },
  });


  
  const handleSubmit = (e) => {
    e.preventDefault();

   
    if (!email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }


    loginMutation.mutate({ email, password });
  };

  const motionDiv = (children, i) => (
    <motion.div
      custom={i}
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5 },
      }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="relative w-full flex justify-center items-center overflow-hidden">
      
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
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" },
        }}
      >
        <div className="backdrop-blur-xl bg-white/80 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Header */}
          {motionDiv(
            <div className="mb-6 sm:mb-8 flex flex-col items-center text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
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
                      <IconButton
                        edge="end"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />,
              2
            )}

            {motionDiv(
              <div className="flex flex-col sm:flex-row items-center justify-between text-sm">
                <FormControlLabel control={<Checkbox />} label="Remember me" />
              </div>,
              3
            )}

            {motionDiv(
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loginMutation.isPending}
                sx={{
                  background: "linear-gradient(to right, #1f2937, #000)",
                  py: "10px",
                  borderRadius: "8px",
                  "&:hover": {
                    background: "linear-gradient(to right, #374151, #111)",
                  },
                }}
              >
                {loginMutation.isPending ? (
                  <>
                    <CircularProgress
                      size={20}
                      sx={{ color: "white", mr: 1 }}
                    />
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight size={20} style={{ marginLeft: 8 }} />
                  </>
                )}
              </Button>
            )}
          </form>

          {motionDiv(
            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-gray-900 font-semibold hover:underline"
              >
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
