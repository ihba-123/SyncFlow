import { Search, Moon, Sun, Menu, TvMinimal, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";
import { cn } from "../../utils/utils";
import useTheme from "../../hooks/useTheme";

export function ProtectedNavbar({ isExpanded, setIsExpanded, isMobile }) {
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMobileMenu = () => setIsExpanded((prev) => !prev);

  const handleSelect = (mode) => {
    setTheme(mode); // set theme: dark, light, system
    setDropdownOpen(false); // auto-close dropdown
  };

  const renderIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="w-5 h-5" />;
      case "light":
        return <Sun className="w-5 h-5" />;
      case "system":
        return <TvMinimal className="w-5 h-5" />;
      default:
        return <Moon className="w-5 h-5" />;
    }
  };

  const renderName = () => {
    switch (theme) {
      case "dark":
        return "Dark";
      case "light":
        return "Light";
      case "system":
        return "System";
      default:
        return "";
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-16    backdrop-blur-lg border bg-background border-black/20 dark:border-white/10 border-l-0 transition-all duration-300 z-50",
        !isMobile && (isExpanded ? "left-64" : "left-16"),
        isMobile && "left-0 w-full"
      )}
    >
      <div className="flex items-center  justify-between h-full px-4 md:px-6">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="hover:bg-accent/50 relative z-10"
            >
              {isExpanded ? (
                <X className="w-5 text-black dark:text-white h-5" />
              ) : (
                <Menu className="w-5 text-black dark:text-white h-5" />
              )}
            </Button>
          )}

          <div className="flex items-center gap-3">
           
            <span className="font-extrabold font-sans  text-black dark:text-foreground hidden sm:block">
              SyncFlow
            </span>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4 relative">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent/10 text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white hidden sm:flex"
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Theme Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="border dark:hover:text-white hover:bg-white/5 border-black/30 text-black/80 hover:text-black dark:text-white/80 dark:border-white/10 flex items-center gap-2 px-5 h-10 w-24 py-1"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <span className="text-sm font-normal">{renderIcon()}</span>
              <span className="text-sm font-normal">{renderName()}</span>
            </Button>

            {dropdownOpen && (
              <div className="absolute  border right-4 mt-4 w-32 text-black dark:text-white bg-gray-200 dark:bg-gray-900 rounded-sm border-black/10 dark:border-white/10 shadow-lg z-50">
                <button
                  className="flex items-center gap-2 text-sm w-full px-4 py-2 hover:bg-accent/20"
                  onClick={() => handleSelect("dark")}
                >
                  <Moon  className="w-5  h-7" /> Dark
                </button>
                <div className="py-1">
                  <div className="h-px bg-gradient-to-r  text-sm from-transparent via-gray-800 dark:via-indigo-400/30 to-transparent" />
                </div>
                <button
                  className="flex items-center gap-2 w-full  text-sm px-4 py-2 hover:bg-accent/20"
                  onClick={() => handleSelect("light")}
                >
                  <Sun className="w-4 h-4" /> Light
                </button>
                <div className="py-1">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-800 dark:via-indigo-400/30 to-transparent" />
                </div>
                <button
                  className="flex items-center gap-2 w-full  text-sm px-4 py-2 hover:bg-accent/20"
                  onClick={() => handleSelect("system")}
                >
                  <TvMinimal className="w-4 h-4" /> System
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
