import { Github, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Login", href: "/login", isRoute: true },
  ];

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <footer
      className="relative overflow-hidden border-t border-black/10"
      style={{
        background: "linear-gradient(135deg, #f8fbff 0%, #f2f6ff 45%, #eef3ff 100%)",
      }}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full filter blur-3xl opacity-25 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-300 rounded-full filter blur-3xl opacity-20 -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 mb-8 items-center">
          <motion.div
            className="col-span-1"
            initial="hidden"
            whileInView="visible"
            variants={itemVariants}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/sync.png" alt="SyncFlow Logo" />
              </div>
              <span className="text-xl font-bold text-gray-800">SyncFlow</span>
            </div>
            <p className="text-gray-600 text-sm">
              Project management that feels fast, clear, and modern.
            </p>
            <div className="flex gap-3 mt-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-lg glass-light flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-white/50 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-3 md:justify-end"
            initial="hidden"
            whileInView="visible"
            variants={itemVariants}
            viewport={{ once: true }}
          >
            {footerLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="rounded-full border border-slate-300 bg-white/60 px-4 py-2 text-sm text-slate-700 transition-colors hover:border-slate-500 hover:text-slate-900"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-full border border-slate-300 bg-white/60 px-4 py-2 text-sm text-slate-700 transition-colors hover:border-slate-500 hover:text-slate-900"
                >
                  {link.label}
                </a>
              )
            )}
          </motion.div>
        </div>

        <motion.div
          className="border-t border-gray-300/50 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4"
          initial="hidden"
          whileInView="visible"
          variants={itemVariants}
          viewport={{ once: true }}
        >
          <p className="text-gray-700 text-sm text-center sm:text-left">
            © {currentYear} SyncFlow. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">Built for focused teams.</p>
        </motion.div>
      </div>
    </footer>
  );
}