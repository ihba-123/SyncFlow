import { Moon, Sun, Menu, Monitor, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/utils";
import useTheme from "../../hooks/useTheme";
import SearchUI from "../../features/search/SearchUI";

export function ProtectedNavbar({ isExpanded, setIsExpanded, isMobile }) {
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMobileMenu = () => setIsExpanded((prev) => !prev);

  const handleSelect = (mode) => {
    setTheme(mode);
    setDropdownOpen(false);
  };

  const themeOptions = [
    { icon: Sun, label: "Light", value: "light" },
    { icon: Moon, label: "Dark", value: "dark" },
    { icon: Monitor, label: "System", value: "system" },
  ];

  const getCurrentIcon = () => {
    const option = themeOptions.find(opt => opt.value === theme);
    return option?.icon || Moon;
  };

  const CurrentIcon = getCurrentIcon();

  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-14 bg-white/40 dark:bg-gray-950/40 backdrop-blur-md border-b border-gray-200/30 dark:border-gray-800/30 transition-all duration-300 z-50",
        !isMobile && (isExpanded ? "left-64" : "left-16"),
        isMobile && "left-0 w-full"
      )}
    >
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center gap-4">
          {isMobile && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleMobileMenu}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <X className="w-5 text-gray-900 dark:text-white" />
              ) : (
                <Menu className="w-5 text-gray-900 dark:text-white" />
              )}
            </motion.button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <SearchUI />

          {/* Theme Toggle Button */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all",
                "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200",
                "hover:bg-gray-200 dark:hover:bg-gray-700",
                dropdownOpen && "bg-gray-200 dark:bg-gray-700"
              )}
            >
              <motion.div
                key={theme}
                initial={{ scale: 0.8, opacity: 0, rotate: -90 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotate: 90 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, duration: 0.4 }}
              >
                <CurrentIcon className="w-4 h-4" />
              </motion.div>
              <span className="hidden sm:inline capitalize">{theme}</span>
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
                >
                  <div className="p-1 space-y-0.5">
                    {themeOptions.map((option) => {
                      const Icon = option.icon;
                      const isActive = theme === option.value;
                      return (
                        <motion.button
                          key={option.value}
                          whileHover={{ x: 2 }}
                          onClick={() => handleSelect(option.value)}
                          className={cn(
                            "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all",
                            isActive
                              ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          )}
                        >
                          <motion.div
                            initial={{ rotate: -90, scale: 0.8 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, duration: 0.3 }}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </motion.div>
                          <span>{option.label}</span>
                          {isActive && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="ml-auto w-1.5 h-1.5 rounded-full bg-current"
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
