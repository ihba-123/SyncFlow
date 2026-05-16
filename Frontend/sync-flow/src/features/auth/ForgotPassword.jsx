import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import GameButton from "../../components/ui/GameButton";
import { requestResetOtp, resetPassword } from "../../api/reset_password";

const INPUT_STYLES = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    "& fieldset": {
      borderColor: "rgba(200, 200, 200, 0.3)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(59, 130, 246, 0.5)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgb(59, 130, 246)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgb(107, 114, 128)",
  },
};

// ===========================
// ANIMATION VARIANTS
// ===========================

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.4 },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

// ===========================
// HELPER COMPONENTS
// ===========================

const MotionDiv = ({ children, index }) => (
  <motion.div custom={index} variants={ITEM_VARIANTS} initial="hidden" animate="visible">
    {children}
  </motion.div>
);

const StageHeader = ({ icon: Icon, title, subtitle }) => (
  <MotionDiv index={0}>
    <div className="text-center mb-8">
      <motion.div className="inline-block mb-4" whileHover={{ scale: 1.1 }}>
        <Icon className="text-gray-900" size={32} />
      </motion.div>
      <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
        {title}
      </h1>
      <p className="text-gray-600 text-sm">{subtitle}</p>
    </div>
  </MotionDiv>
);

const SubmitButton = ({ loading, disabled, onClick, children, index = 2 }) => (
  <MotionDiv index={index}>
    <GameButton
      type="submit"
      fullWidth
      variant="primary"
      size="lg"
      loading={loading}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </GameButton>
  </MotionDiv>
);

const PasswordField = ({ label, value, onChange, showPassword, onToggleVisibility, index }) => (
  <MotionDiv index={index}>
    <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <TextField
        fullWidth
        label={label}
        type={showPassword ? "text" : "password"}
        variant="outlined"
        value={value}
        onChange={onChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock size={18} className="text-green-600" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end" onClick={onToggleVisibility}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={INPUT_STYLES}
      />
    </motion.div>
  </MotionDiv>
);

// ===========================
// MAIN COMPONENT
// ===========================

const ForgotPassword = () => {
  const navigate = useNavigate();
  const otpInputRefs = useRef([]);

  // State
  const [stage, setStage] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpVerified, setOtpVerified] = useState(false);

  const requestOtpMutation = useMutation({
    mutationFn: requestResetOtp,
    onSuccess: () => {
      toast.success("OTP sent to your email");
      setStage("otp");
      setOtp(["", "", "", "", "", ""]);
      setNewPassword("");
      setConfirmPassword("");
      setOtpVerified(false);
      setResendTimer(300);
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Failed to send OTP. Please try again.");
      toast.error(message);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password reset successfully!");
      navigate("/login");
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Failed to reset password. Please try again.");
      toast.error(message);
    },
  });

  const loading = requestOtpMutation.isPending || resetPasswordMutation.isPending;

  // Timer effect
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(interval);
    }
  }, [resendTimer]);

  const getErrorMessage = (error, fallbackMessage) => {
    const responseData = error?.response?.data;

    if (!responseData) {
      return fallbackMessage;
    }

    if (typeof responseData === "string") {
      return responseData;
    }

    if (responseData.error) {
      return responseData.error;
    }

    if (responseData.message) {
      return responseData.message;
    }

    if (responseData.detail) {
      return responseData.detail;
    }

    const firstField = Object.values(responseData).find((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }

      return typeof value === "string" && value.length > 0;
    });

    if (Array.isArray(firstField)) {
      return firstField[0];
    }

    if (typeof firstField === "string") {
      return firstField;
    }

    return fallbackMessage;
  };

  // ===========================
  // EVENT HANDLERS
  // ===========================

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email address");
      return;
    }

    requestOtpMutation.mutate({ email });
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    setOtpVerified(true);
    toast.success("OTP verified successfully!");
    setTimeout(() => setStage("reset"), 300);
  };

  const handleResendOtp = () => {
    if (resendTimer === 0 && email) {
      requestOtpMutation.mutate({ email });
    }
  };

  // ===========================
  // RENDER METHODS
  // ===========================

  const renderEmailStage = () => (
    <motion.div key="email-stage" variants={CONTAINER_VARIANTS} initial="hidden" animate="visible" exit="exit">
      <StageHeader icon={Mail} title="Forgot Password?" subtitle="Enter your email to receive an OTP" />

      <form onSubmit={handleEmailSubmit} className="space-y-6">
        <MotionDiv index={1}>
          <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} className="text-blue-600" />
                  </InputAdornment>
                ),
              }}
              sx={INPUT_STYLES}
            />
          </motion.div>
        </MotionDiv>

        <SubmitButton className="text-amber-50 -z-100" loading={requestOtpMutation.isPending} disabled={requestOtpMutation.isPending || !email} index={2}>
          Send OTP <ArrowRight size={18} style={{ marginLeft: 8 }} />
        </SubmitButton>
      </form>

      <MotionDiv index={3}>
        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password?{" "}
          <button onClick={() => navigate("/login")} className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            Sign in
          </button>
        </p>
      </MotionDiv>
    </motion.div>
  );

  const renderOtpStage = () => (
    <motion.div key="otp-stage" variants={CONTAINER_VARIANTS} initial="hidden" animate="visible" exit="exit">
      <StageHeader icon={Clock} title="Verify OTP" subtitle={`Enter the 6-digit code sent to ${email}`} />

      {resendTimer > 0 && (
        <MotionDiv index={1}>
          <div className="bg-amber-50/50 border border-amber-200/30 rounded-xl p-3 mb-6 flex items-center justify-between">
            <span className="text-sm text-amber-700">
              OTP expires in: <span className="font-bold">{Math.floor(resendTimer / 60)}:{String(resendTimer % 60).padStart(2, "0")}</span>
            </span>
          </div>
        </MotionDiv>
      )}

      <form onSubmit={handleOtpSubmit} className="space-y-6">
        <MotionDiv index={2}>
          <div className="space-y-4">
            <div className="flex gap-2 sm:gap-3 justify-center">
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={(el) => (otpInputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  disabled={loading}
                  whileFocus={{ scale: 1.1 }}
                  className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-lg font-bold rounded-xl border-2 transition-all focus:outline-none backdrop-blur-sm ${
                    otpVerified
                      ? "bg-green-50/50 border-green-300 text-green-600"
                      : digit
                      ? "bg-blue-50/50 border-blue-400 text-blue-600"
                      : "bg-white/50 border-gray-300 text-gray-900"
                  }`}
                />
              ))}
            </div>
          </div>
        </MotionDiv>

        <SubmitButton loading={loading} disabled={loading || otp.join("").length !== 6} index={3}>
          Verify OTP <CheckCircle size={18} style={{ marginLeft: 8 }} />
        </SubmitButton>
      </form>

      <MotionDiv index={4}>
        <p className="text-center text-sm text-gray-600 mt-6">
          Didn't receive the code?{" "}
          <button
            onClick={handleResendOtp}
            disabled={resendTimer > 0 || requestOtpMutation.isPending}
            className={`font-semibold transition-colors ${resendTimer > 0 || requestOtpMutation.isPending ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-700"}`}
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
          </button>
        </p>
      </MotionDiv>

      <MotionDiv index={5}>
        <button
          onClick={() => {
            setStage("email");
            setOtp(["", "", "", "", "", ""]);
            setNewPassword("");
            setConfirmPassword("");
            setResendTimer(0);
            setOtpVerified(false);
          }}
          className="w-full text-center text-sm text-gray-600 hover:text-gray-900 transition-colors mt-4"
        >
          ← Back
        </button>
      </MotionDiv>
    </motion.div>
  );

  const renderResetStage = () => (
    <motion.div key="reset-stage" variants={CONTAINER_VARIANTS} initial="hidden" animate="visible" exit="exit">
      <StageHeader icon={CheckCircle} title="Reset Password" subtitle="Create a strong new password" />

      <form onSubmit={(e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
          toast.error("Please fill in all fields");
          return;
        }

        if (newPassword.length < 8) {
          toast.error("Password must be at least 8 characters");
          return;
        }

        if (newPassword !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }

        resetPasswordMutation.mutate({
          email,
          otp: otp.join(""),
          newPassword,
        });
      }} className="space-y-4">
        <PasswordField label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} showPassword={showPassword} onToggleVisibility={() => setShowPassword(!showPassword)} index={1} />

        {newPassword && (
          <MotionDiv index={2}>
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    newPassword.length >= (i + 1) * 2 ? (i < 2 ? "bg-red-400" : i < 3 ? "bg-yellow-400" : "bg-green-400") : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </MotionDiv>
        )}

        <PasswordField label="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} showPassword={showConfirm} onToggleVisibility={() => setShowConfirm(!showConfirm)} index={3} />

        {confirmPassword && (
          <MotionDiv index={4}>
            <div className={`flex items-center gap-2 text-sm ${newPassword === confirmPassword ? "text-green-600" : "text-red-600"}`}>
              {newPassword === confirmPassword ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {newPassword === confirmPassword ? "Passwords match" : "Passwords do not match"}
            </div>
          </MotionDiv>
        )}

        <SubmitButton loading={resetPasswordMutation.isPending} disabled={resetPasswordMutation.isPending || !newPassword || !confirmPassword} index={5}>
          Reset Password <CheckCircle size={18} style={{ marginLeft: 8 }} />
        </SubmitButton>
      </form>

      <MotionDiv index={6}>
        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password?{" "}
          <button onClick={() => navigate("/login")} className="text-green-600 font-semibold hover:text-green-700 transition-colors">
            Sign in
          </button>
        </p>
      </MotionDiv>

      <MotionDiv index={7}>
        <button
          onClick={() => {
            setStage("otp");
            setConfirmPassword("");
          }}
          className="w-full text-center text-sm text-gray-600 hover:text-gray-900 transition-colors mt-4"
        >
          ← Back
        </button>
      </MotionDiv>
    </motion.div>
  );

  // ===========================
  // MAIN RENDER
  // ===========================

  return (
    <div className="relative w-full min-h-screen flex justify-center items-center overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
      {/* Background blobs */}
      <motion.div
        className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-linear-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
        animate={{ x: [0, 50, -50, 0], y: [0, 30, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{ top: "-10%", left: "-10%" }}
      />
      <motion.div
        className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-linear-to-br from-purple-200/20 to-blue-200/20 rounded-full blur-3xl"
        animate={{ x: [0, -50, 50, 0], y: [0, -30, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{ bottom: "-10%", right: "-10%" }}
      />

      {/* Main container */}
      <motion.div className="w-full max-w-md sm:max-w-lg z-10 px-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
        {/* Card */}
        <div className="backdrop-blur-xl bg-white/85 border border-white/20 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <AnimatePresence mode="wait">
            {stage === "email" && renderEmailStage()}
            {stage === "otp" && renderOtpStage()}
            {stage === "reset" && renderResetStage()}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }} className="text-center text-xs text-gray-500 mt-8">
          &copy; {new Date().getFullYear()} SyncFlow. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
