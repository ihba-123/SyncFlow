import React from "react";

export const Button = ({ children, variant = "primary", onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-3 rounded-xl font-medium transition-transform duration-300
        backdrop-blur-md border
        ${variant === "primary" ? 
          "bg-white/10 text-white border-white/30 hover:bg-white/20 hover:-translate-y-1" : 
          "bg-black/10 text-white border-white/20 hover:bg-black/20 hover:-translate-y-1"
        }
      `}
    >
      {children}
    </button>
  );
};
