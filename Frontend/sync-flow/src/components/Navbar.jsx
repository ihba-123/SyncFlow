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

  const navLinks = [
    { label: "Home", href: "Hero", icon: Home },
    { label: "Features", href: "features", icon: Sparkles },
    { label: "How it works", href: "how-it-works", icon: Workflow },
  ];

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-transparent backdrop-blur-xl shadow-[0_10px_28px_rgb(15,23,42,0.08)] border-b border-white/35 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/" className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-500 p-1.5 shadow-lg shadow-blue-500/30">
                  <img src="/sync.png" alt="SyncFlow" className="h-full w-full object-contain" />
                </div>
                <span className="text-lg font-semibold tracking-tight text-slate-800">SyncFlow</span>
              </Link>
            </motion.div>

            <div className="hidden lg:flex items-center gap-2 rounded-full bg-white/45 px-2 py-1 backdrop-blur-md border border-white/70 shadow-sm">
              {navLinks.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <motion.button
                    key={link.label}
                    onClick={() => slowScrollTo(link.href)}
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.25 }}
                    className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-900 hover:text-white"
                  >
                    <IconComponent size={15} className="transition-transform duration-200 group-hover:-rotate-6" />
                    {link.label}
                  </motion.button>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/45 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-slate-900 hover:text-slate-900"
              >
                Login
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-transform hover:-translate-y-0.5"
              >
                <Rocket size={15} />
                Get Started
              </Link>
            </div>

            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="inline-flex lg:hidden items-center justify-center rounded-xl border border-slate-200 bg-white/85 p-2 text-slate-700 shadow-sm"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ y: -18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed left-4 right-4 top-20 z-50 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-2xl shadow-slate-900/15 lg:hidden"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <button
                      key={link.label}
                      onClick={() => {
                        slowScrollTo(link.href);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
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
                    className="rounded-xl border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl bg-slate-900 px-3 py-2 text-center text-sm font-semibold text-white"
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