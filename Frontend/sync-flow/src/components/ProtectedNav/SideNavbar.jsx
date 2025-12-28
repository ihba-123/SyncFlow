import {
  Home,
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  MessageSquare,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/Toolltip";
import { cn } from "../../utils/utils";
import { useAuth } from "../../hooks/Auth";
import { useUserProfile } from "../../hooks/UserProfile";
import Logout from "../../features/auth/Logout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export function Sidebar({ isExpanded, setIsExpanded, isMobile }) {
  const { data } = useAuth();
  const { name, photo, is_online } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { icon: Home, label: "Home", to: "/home" },
    { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
    { icon: Users, label: "Team", to: "/team" },
    { icon: FileText, label: "Documents", to: "/documents" },
    { icon: MessageSquare, label: "Messages", to: "/messages" },
  ];

  const bottomItems = [
    { icon: Bell, label: "Notifications", to: "/notifications" },
    { icon: Settings, label: "Settings", to: "/settings" },
  ];

  const handleNavClick = () => {
    if (isMobile) {
      setIsExpanded(false);
    }
  };

  const handleEditProfileClick = () => {
    setOpen(false);
    if (isMobile) setIsExpanded(false);
    navigate("/dashboard/profile");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full glass-card border-r border-black/20 dark:border-white/10 z-50",
        "flex flex-col",
        !isMobile && "transition-[width] duration-500 ease-in-out",
        isMobile && "transition-transform duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-16",
        isMobile && !isExpanded && "-translate-x-full",
        isMobile && isExpanded && "translate-x-0"
      )}
    >
      <div className="relative flex flex-col h-full bg-background/40 p-3 overflow-hidden">
        {/* Logo & Toggle */}
        <div className="relative flex items-center justify-between h-14 mb-6">
          <div
            className={cn(
              "flex items-center",
              isExpanded ? "justify-start" : "justify-center w-full"
            )}
          >
            {isExpanded ? (
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br dark:from-indigo-500/20 to-white flex items-center justify-center backdrop-blur-sm border border-indigo-400/20">
                  <img src="/sync.png" alt="Logo" className="w-10 h-8" />
                </div>
                <span className="text-lg font-semibold text-black/60 dark:text-white">
                  SyncFlow
                </span>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-200 to-white flex items-center justify-center backdrop-blur-sm border border-indigo-400/20">
                <img src="/sync.png" alt="Logo" className="w-10 h-8" />
              </div>
            )}
          </div>

          {!isMobile && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-gray-500/70 dark:border-indigo-400/30",
                "bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-indigo-500/20 transition-all duration-300 z-10"
              )}
            >
              {isExpanded ? (
                <ChevronLeft className="w-4 h-4 text-gray-800 dark:text-gray-300" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-800 dark:text-gray-300" />
              )}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <TooltipProvider key={item.label}>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.to}
                    onClick={handleNavClick}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300",
                      "hover:bg-[#66b3ff86] dark:hover:bg-indigo-500/25 hover:border-primary hover:shadow-lg hover:shadow-indigo-500/10",
                      isActive(item.to)
                        ? "bg-[#66b3ff9a] not-first:dark:bg-indigo-500/25 border border-indigo-400/40 text-indigo-300 shadow-md shadow-indigo-500/20"
                        : "text-gray-300",
                      isExpanded ? "justify-start" : "justify-center"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 flex-shrink-0 transition-colors",
                        isActive(item.to)
                          ? "text-black/80 dark:text-indigo-300"
                          : "text-gray-800 dark:text-gray-400 group-hover:text-indigo-900 dark:group-hover:text-indigo-300"
                      )}
                    />
                    {isExpanded && (
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors",
                          isActive(item.to)
                            ? "text-black/80 dark:text-indigo-200"
                            : "text-gray-800 dark:text-gray-200 group-hover:text-indigo-900 dark:group-hover:text-indigo-200"
                        )}
                      >
                        {item.label}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                {!isExpanded && (
                  <TooltipContent
                    side="right"
                    className="dark:bg-indigo-500/10 bg-black/30 backdrop-blur-md border-indigo-400/30 text-white"
                  >
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}

          <div className="py-4">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-800 dark:via-indigo-400/30 to-transparent" />
          </div>

          {bottomItems.map((item) => (
            <TooltipProvider key={item.label}>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.to}
                    onClick={handleNavClick}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300",
                      "hover:bg-[#66b3ff9a] dark:hover:bg-indigo-500/25 hover:border-indigo-400/30 hover:shadow-lg hover:shadow-indigo-500/10",
                      isActive(item.to)
                        ? "bg-[#66b3ff9a] not-first:dark:bg-indigo-500/25 border border-indigo-400/40 text-indigo-300 shadow-md shadow-indigo-500/20"
                        : "text-gray-300",
                      isExpanded ? "justify-start" : "justify-center"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 flex-shrink-0 transition-colors",
                        isActive(item.to)
                          ? "text-black/80 dark:text-indigo-300"
                          : "text-gray-800 dark:text-gray-400 group-hover:text-indigo-900 dark:group-hover:text-indigo-300"
                      )}
                    />
                    {isExpanded && (
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors",
                          isActive(item.to)
                            ? "text-black/80 dark:text-indigo-200"
                            : "text-gray-800 dark:text-gray-200 group-hover:text-indigo-900 dark:group-hover:text-indigo-200"
                        )}
                      >
                        {item.label}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                {!isExpanded && (
                  <TooltipContent
                    side="right"
                    className="dark:bg-indigo-500/10 bg-black/30 backdrop-blur-md border-indigo-400/30 text-white"
                  >
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>

        {/* User Profile Popover */}
        <div className="pt-4 z-100">
          <div className="py-4">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-800 dark:via-indigo-400/30 to-transparent" />
          </div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "group flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all duration-300",
                  isExpanded ? "justify-start" : "justify-center"
                )}
              >
                <div className="relative">
                  <Avatar className="w-10 h-10 border-2 border-indigo-400/40">
                    <AvatarImage src={photo} />
                    <AvatarFallback className="bg-indigo-500/20 text-indigo-300 text-sm font-medium">
                      {name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {is_online && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white dark:border-background ring-2 ring-background" />
                  )}
                </div>

                {isExpanded && (
                  <div className="text-left flex-1">
                    <p className="text-sm font-extrabold text-black/80 dark:text-gray-400 truncate">
                      {name || "User"}
                    </p>
                    <p className="text-xs text-black/80 font-bold dark:text-gray-400 truncate">
                      {data?.email}
                    </p>
                  </div>
                )}
              </button>
            </PopoverTrigger>

            <PopoverContent
              side="top"
              align={isExpanded ? "start" : "center"}
              sideOffset={12}
              className="w-44 h-auto z-100 p-3 bg-background/95 backdrop-blur-md rounded-2xl border border-black/20 dark:border-white/10 shadow-2xl"
            >
              <div className="space-y-1">
                <button
                  onClick={handleEditProfileClick}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-gray-600 cursor-pointer rounded-lg transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Profile
                </button>

                <div>
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-800 dark:via-indigo-400/30 to-transparent" />
                </div>

                <Logout onLogout={() => setOpen(false)} />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </aside>
  );
}
