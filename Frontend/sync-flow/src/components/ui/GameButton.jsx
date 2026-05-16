import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

const GameButton = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
  icon: Icon,
  ...props
}) => {
  // Color variants
  const colorVariants = {
    primary: {
      background: "linear-gradient(180deg, #1a1a1a 0%, #000000 100%)",
      hoverBg: "linear-gradient(180deg, #0a0a0a 0%, #000000 100%)",
      text: "#ffffff",
    },
    success: {
      background: "linear-gradient(180deg, #065f46 0%, #047857 100%)",
      hoverBg: "linear-gradient(180deg, #047857 0%, #059669 100%)",
      text: "#ffffff",
    },
    danger: {
      background: "linear-gradient(180deg, #7f1d1d 0%, #991b1b 100%)",
      hoverBg: "linear-gradient(180deg, #991b1b 0%, #b91c1c 100%)",
      text: "#ffffff",
    },
    secondary: {
      background: "linear-gradient(180deg, #374151 0%, #1f2937 100%)",
      hoverBg: "linear-gradient(180deg, #1f2937 0%, #111827 100%)",
      text: "#ffffff",
    },
  };

  // Size variants
  const sizeVariants = {
    sm: {
      py: "8px",
      px: "12px",
      fontSize: "14px",
      fontWeight: "700",
    },
    md: {
      py: "12px",
      px: "16px",
      fontSize: "16px",
      fontWeight: "800",
    },
    lg: {
      py: "14px",
      px: "20px",
      fontSize: "18px",
      fontWeight: "800",
    },
  };

  const colors = colorVariants[variant] || colorVariants.primary;
  const sizeStyle = sizeVariants[size] || sizeVariants.md;

  const buttonStyles = {
    background: colors.background,
    ...sizeStyle,
    borderRadius: "8px",
    textTransform: "none",
    color: `${colors.text} !important`,
    boxShadow:
      "inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 8px 16px rgba(0, 0, 0, 0.6), 0 4px 8px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)",
    border: "2px solid rgba(0, 0, 0, 0.3)",
    position: "relative",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
    letterSpacing: "0.5px",
    transition: "all 0.15s ease",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fullWidth: fullWidth,
    "&:hover:not(:disabled)": {
      background: colors.hoverBg,
      boxShadow:
        "inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 10px 20px rgba(0, 0, 0, 0.7), 0 5px 10px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.4)",
      transform: "scale(1.02)",
    },
    "&:active:not(:disabled)": {
      background: colors.hoverBg,
      boxShadow:
        "inset 0 3px 6px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.5), inset 0 -1px 2px rgba(255, 255, 255, 0.1)",
      transform: "scale(0.98)",
    },
    "&:disabled": {
      opacity: 0.5,
      background: colors.background,
      boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 8px rgba(0, 0, 0, 0.3)",
      cursor: "not-allowed",
      color: `${colors.text} !important`,
    },
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "1px",
      background: "linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1))",
      pointerEvents: "none",
      zIndex: 0,
    },
  };

  return (
    <motion.div whileHover={{ scale: disabled ? 1 : 1 }} whileTap={{ scale: disabled ? 1 : 0.98 }}>
      <Button
        type={type}
        fullWidth={fullWidth}
        disabled={disabled || loading}
        onClick={onClick}
        sx={buttonStyles}
        {...props}
      >
        {loading ? (
          <CircularProgress size={20} sx={{ color: colors.text }} />
        ) : (
          <>
            {Icon && <Icon size={18} />}
            {children}
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default GameButton;
