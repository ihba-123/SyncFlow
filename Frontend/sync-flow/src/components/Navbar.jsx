import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  Zap,
  GitBranch,
  FolderOpen,
  Mail,
  LogIn,
  UserPlus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@mui/material";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#", icon: Home },
    { label: "Features", href: "#features", icon: Zap },
    { label: "How It Works", href: "#how-it-works", icon: GitBranch },
    { label: "Projects", href: "#projects", icon: FolderOpen },
    { label: "Contact", href: "#", icon: Mail },
  ];

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 },
    }),
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      x: 50,
      transition: { duration: 0.3 },
    },
  };

  return (
    <nav
      className={`fixed top-0 font-serif left-0 right-0 z-50 transition-all duration-300 ${
        isSticky ? "glass-light py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-15 h-10  flex items-center  ">
              <img src="sync.png" alt="" srcset="" />
              <span className="text-gray-600 font-bold text-lg">SyncFLow</span>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:hidden  lg:flex items-center gap-13">
            {navLinks.map((link, i) => {
              const IconComponent = link.icon;
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="flex items-center font-semibold gap-2 text-sm text-gray-700 hover:text-foreground transition-colors duration-200 group"
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={menuVariants}
                >
                  <IconComponent
                    size={20}
                    className="group-hover:scale-110 transition-transform duration-200"
                  />
                  {link.label}
                </motion.a>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="outlined"
              size="medium"
              sx={{
                borderColor: "gray",
                color: "black",
                "&:hover": {
                  borderColor: "gray",
                },
              }}
            >
              <LogIn size={16} /> Login
            </Button>

            <Button
              size="medium"
              variant="contained"
              className="flex gap-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white "
            >
              <UserPlus size={16} /> Sign Up
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden md:flex text-foreground p-2 z-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Mobile Menu Slide */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="fixed top-0 left-0 w-64 h-screen bg-white shadow-xl z-50 p-5"
            >
              <div className="ml-9">
                <div className="w-15 h-10 lg:hidden  flex items-center justify-center ">
                  <img src="sync.png" alt="" srcset="" className="" />
                  <span className="text-gray-600 font-bold text-lg">
                    SyncFLow
                  </span>
                </div>
              </div>
              <div className="flex my-5 rounded">
                {/* #making horizontal line */}
                <span className="w-full h-0.5 bg-gray-200 border border-gray-200 "></span>
              </div>
              <div className="flex flex-col gap-5 mt-10">
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      className="flex items-center gap-3 text-lg text-gray-700 hover:text-black transition"
                      onClick={() => setIsOpen(false)}
                    >
                      <IconComponent size={18} /> {link.label}
                    </a>
                  );
                })}

                <div className="flex flex-col gap-3 mt-4 border-t  pt-4">
                  <Button
                    variant="outlined"
                    size="medium"
                    sx={{
                      borderColor: "gray",
                      color: "black",
                      "&:hover": {
                        borderColor: "gray",
                      },
                    }}
                  >
                    <LogIn size={16} /> Login
                  </Button>

                  <Button
                    size="medium"
                    variant="contained"
                    className="flex gap-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white "
                  >
                    <UserPlus size={16} /> Sign Up
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
