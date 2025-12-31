import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Projects: [
      { label: "Featured Work", href: "#projects" },
      { label: "All Projects", href: "#" },
      { label: "Open Source", href: "#" },
      { label: "Portfolio", href: "#" },
    ],
    Company: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Hire Me", href: "#" },
    ],
    Resources: [
      { label: "Documentation", href: "#" },
      { label: "Guides", href: "#" },
      { label: "API Docs", href: "#" },
      { label: "Resources", href: "#" },
    ],
    Legal: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "License", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "#", label: "Email" },
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
        background: "linear-gradient(135deg, #dbeafe 0%, #e6d9ff 45%, #f5f3ff 100%)",
      }}
    >
      {/* Matching blurred accent circles from Hero */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400 rounded-full filter blur-3xl opacity-25 -z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300 rounded-full filter blur-3xl opacity-15 -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <motion.div
            className="col-span-2 md:col-span-1"
            initial="hidden"
            whileInView="visible"
            variants={itemVariants}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="sync.png" alt="SyncFlow Logo" />
              </div>
              <span className="text-xl font-bold text-gray-800">SyncFlow</span>
            </div>
            <p className="text-gray-600 text-sm">
              Modern project management for builders and creators.
            </p>
            {/* Social Icons */}
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

          {/* Link Sections */}
          {Object.entries(footerLinks).map(([title, links], idx) => (
            <motion.div
              key={title}
              className="flex flex-col"
              initial="hidden"
              whileInView="visible"
              variants={itemVariants}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <h4 className="font-semibold text-gray-800 mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-gray-300/50 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
          initial="hidden"
          whileInView="visible"
          variants={itemVariants}
          viewport={{ once: true }}
        >
          <p className="text-gray-700 text-sm text-center sm:text-left">
            © {currentYear} SyncFlow. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-700">
            <a href="#" className="hover:text-gray-900 transition-colors">
              Status
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Changelog
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Sitemap
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}