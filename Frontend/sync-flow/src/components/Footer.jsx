import { Github, Linkedin, Twitter, Mail } from "lucide-react"
import { motion } from "framer-motion"

export function Footer() {
  const currentYear = new Date().getFullYear()

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
  }

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "#", label: "Email" },
  ]

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <footer className="bg-gradient-to-t  from-muted/30 to-transparent border-t border-border/50">
      <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
                <div className="w-8 h-8   rounded-lg flex items-center justify-center">
                    <img src="sync.png" alt="#" />                </div>
              <span className="text-xl font-bold text-foreground">SyncFlow</span>
            </div>
            <p className="text-foreground/60 text-sm">Modern project management for builders and creators.</p>
            {/* Social Icons */}
            <div className="flex gap-3 mt-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-lg glass-light flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-primary/20 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={18} />
                  </motion.a>
                )
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
              <h4 className="font-semibold text-foreground mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-foreground/60 hover:text-foreground text-sm transition-colors duration-200"
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
          className="border-t border-border/50 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
          initial="hidden"
          whileInView="visible"
          variants={itemVariants}
          viewport={{ once: true }}
        >
          <p className="text-foreground/60 text-sm text-center sm:text-left">
            © {currentYear} SyncFlow. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-foreground/60">
            <a href="#" className="hover:text-foreground transition-colors">
              Status
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Changelog
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Sitemap
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
