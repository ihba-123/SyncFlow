import { Moon, Sun, Menu, TvMinimal, Plus, X } from "lucide-react";
import { useState } from "react";
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
        "fixed top-0 right-0 h-14   bg-card/10 backdrop-blur-sm border  border-black/20 dark:border-white/10 border-l-0 transition-all duration-300 z-50",
        !isMobile && (isExpanded ? "left-64" : "left-16"),
        isMobile && "left-0 w-full"
      )}
    >
      <div className="flex items-center  justify-between h-full px-4 md:px-6">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <button
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
            </button>
          )}

          <div className="flex items-center gap-3">
            <span className="font-extrabold font-sans  text-black dark:text-foreground hidden sm:block">
              SyncFlow
            </span>
          </div>
        </div>

       
        <div className="flex items-center gap-4 relative">
        
          <div className="relative flex gap-4.5 items-center justify-center">
           
            <div>
              <SearchUI />
            </div>
            <div>
             
            </div>

            <button
              variant="ghost"
              size="icon"
              className="border dark:hover:text-white hover:bg-white/5 border-primary
              text-black/80 hover:text-black justify-center rounded-sm cursor-pointer dark:text-white/80 dark:border-primary flex items-center gap-2 px-5 h-9 w-24 py-2"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <span className="text-xl font-normal dark:text-[#66B2FF]">
                {renderIcon()}
              </span>
              <span className="text-[15px] font-normal dark:text-[#66B2FF]">
                {renderName()}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute dark:text-[#66B2FF] border right-4 mt-50 w-32   bg-gray-200 dark:bg-gray-900 rounded-sm text-[13px]  border-black/10 dark:border-white/10 shadow-lg z-50">
                <button
                  className="flex items-center gap-2 text-sm w-full px-4 py-2 hover:bg-accent/20"
                  onClick={() => handleSelect("dark")}
                >
                  <Moon className="w-5  h-7" /> Dark
                </button>
                <div className="py-1">
                  <div className="h-px bg-gradient-to-r   text-sm from-transparent via-gray-800 dark:via-indigo-400/30 to-transparent" />
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
