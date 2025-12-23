import { Search, Bell, Moon, Menu, X } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../utils/utils";

export function ProtectedNavbar({ isExpanded, setIsExpanded, isMobile, isMobileMenuOpen, setIsMobileMenuOpen }) {
  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-16 bg-white/5 backdrop-blur-lg border-b border-white/10 transition-all duration-300 z-30",
        isExpanded && !isMobile ? "left-64" : "left-16",
        isMobile && "left-0"
      )}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:bg-white/10"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
              <span className="text-sm font-bold text-foreground">V</span>
            </div>
            <span className="font-semibold text-foreground hidden sm:block">Dashboard</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hover:bg-white/10 hidden sm:flex">
            <Search className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="icon" className="hover:bg-white/10 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          <Button variant="ghost" size="icon" className="hover:bg-white/10">
            <Moon className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
