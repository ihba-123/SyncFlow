import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  Sparkles,
  Workflow,
  Rocket,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { slowScrollTo } from "../utils/slowScroll";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { label: "Home", href: "Hero", icon: Home },
    { label: "Features", href: "features", icon: Sparkles },
    { label: "How it works", href: "how-it-works", icon: Workflow },
  ];

  const handleNavClick = (sectionId) => {
    slowScrollTo(sectionId, 104);
  };

  const handleMobileNavClick = (sectionId) => {
    setIsOpen(false);
    requestAnimationFrame(() => {
      setTimeout(() => {
        slowScrollTo(sectionId, 104);
      }, 60);
    });
  };

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className={`mx-auto max-w-7xl rounded-2xl transition-all duration-300 ${
            isScrolled
              ? "bg-white/62 shadow-[0_20px_48px_rgba(15,23,42,0.14)] backdrop-blur-2xl"
              : "bg-white/52 shadow-[0_14px_36px_rgba(15,23,42,0.1)] backdrop-blur-xl"
          }`}
        >
          <div className="flex h-16 items-center justify-between px-3 sm:px-4 lg:px-6">
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link to="/" className="flex items-center">
                <span
                  className="select-none text-[1.45rem] font-black uppercase leading-none tracking-[-0.08em] sm:text-[1.7rem]"
                  style={{ textShadow: "0 1px 0 rgba(255,255,255,0.55)" }}
                >
                  <span className="text-slate-900">SYNC</span>
                  <span className="text-slate-500">FLOW</span>
                </span>
              </Link>
            </motion.div>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <motion.button
                    type="button"
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.24 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    className="group inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-slate-700 transition-all duration-200 lg:px-4 lg:text-sm hover:bg-slate-900 hover:text-white"
                  >
                    <IconComponent size={15} className="transition-transform duration-200 group-hover:rotate-12" />
                    {link.label}
                  </motion.button>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full bg-white/65 px-3.5 py-2 text-xs font-medium text-slate-700 transition-all hover:text-slate-900 lg:px-4 lg:text-sm"
              >
                Login
              </Link>

              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xl shadow-slate-900/25 transition-all hover:bg-slate-800 lg:px-5 lg:py-2.5 lg:text-sm"
                >
                  <Rocket size={15} />
                  Get Started
                </Link>
              </motion.div>
            </div>

            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="inline-flex md:hidden items-center justify-center rounded-xl bg-white/75 p-2 text-slate-700 shadow-sm backdrop-blur-md"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              aria-controls="mobile-nav-panel"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </motion.div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              id="mobile-nav-panel"
              initial={{ opacity: 0, y: -18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed left-3 right-3 top-24 z-50 rounded-2xl bg-white/82 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.22)] backdrop-blur-2xl sm:left-4 sm:right-4 md:hidden"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <button
                      type="button"
                      key={link.label}
                      onClick={() => handleMobileNavClick(link.href)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
                    >
                      <IconComponent size={16} />
                      {link.label}
                    </button>
                  );
                })}

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl bg-white/70 px-3 py-2.5 text-center text-sm font-semibold text-slate-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl bg-slate-900 px-3 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-slate-900/20"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}