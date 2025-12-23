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
import { Button } from "../ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/Toolltip";
import { cn } from "../../utils/utils";
import { useAuth } from "../../hooks/Auth";
import { useUserProfile } from "../../hooks/UserProfile";
import Logout from "../../features/auth/Logout";

export function Sidebar({ isExpanded, setIsExpanded, isMobile }) {
  const { data } = useAuth();
  const { name, photo, bio, is_online } = useUserProfile();

  const navItems = [
    { icon: Home, label: "Home", href: "#" },
    { icon: LayoutDashboard, label: "Dashboard", href: "#" },
    { icon: Users, label: "Team", href: "#" },
    { icon: FileText, label: "Documents", href: "#" },
    { icon: MessageSquare, label: "Messages", href: "#" },
  ];

  const bottomItems = [
    { icon: Bell, label: "Notifications", href: "#" },
    { icon: Settings, label: "Settings", href: "#" },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full glass-card border-r border-white/10  transition-all duration-600 z-40",
        isExpanded ? "w-64" : "w-16",
        isMobile && !isExpanded && "-translate-x-full"
      )}
    >
      <div className="flex bg-[var(--background)] flex-col h-full p-3">
        {/* Logo Section */}
        <div
          className={cn(
            "flex items-center mb-6 h-14",
            isExpanded ? "justify-between px-2" : "justify-center"
          )}
        >
          {!isExpanded && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                <span className="text-sm font-bold text-foreground">V</span>
              </div>
            </div>
          )}

            {isExpanded && (
            <div className="flex items-center justify-center ml-12 gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/100 to-white/5 flex items-center justify-center">
                <img src="sync.png" alt="" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1">
          
          {navItems.map((item) => (
            <TooltipProvider key={item.label}>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <a
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      "hover:bg-white/10 text-white hover:text-white",
                      isExpanded ? "justify-start" : "justify-center"
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {isExpanded && (
                      <span
                        className={cn(
                          "overflow-hidden whitespace-nowrap transition-all duration-300",
                          isExpanded ? "opacity-100 w-40" : "opacity-0 w-0"
                        )}
                      >
                        {item.label}
                      </span>
                    )}
                  </a>
                </TooltipTrigger>
                {!isExpanded && (
                  <TooltipContent
                    side="right"
                    className="bg-background text-white rounded-md px-2 py-1 shadow-lg"
                  >
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}

          {/* Divider */}
          <div className="py-3">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Bottom Items */}
          {bottomItems.map((item) => (
            <TooltipProvider delayDuration={200} key={item.label}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <a
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      "hover:bg-white/10 text-white hover:text-white",
                      isExpanded ? "justify-start" : "justify-center"
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {isExpanded && (
                      <span
                        className={cn(
                          "overflow-hidden whitespace-nowrap transition-all duration-300",
                          isExpanded ? "opacity-100 w-40" : "opacity-0 w-0"
                        )}
                      >
                        {item.label}
                      </span>
                    )}
                  </a>
                </TooltipTrigger>
                {!isExpanded && (
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>

        {/* User Profile */}
        <div className="pt-3 border-t border-white/10 flex-shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(  
                  "flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white/10",
                  isExpanded ? "justify-start" : "justify-center"
                )}
              >
                <div className="relative">
                  <Avatar className="w-8 h-8 border border-white/10">
                    <AvatarImage src={photo} />
                    <AvatarFallback>{name?.[0] || "CN"}</AvatarFallback>
                  </Avatar>
                  {/* Online/Offline Dot outside avatar */}
                  <span
                    className={cn(
                      "absolute w-3 h-3 rounded-full border-2 border-black top-5 left-5",
                      is_online ? "bg-green-500" : "bg-gray-400"
                    )}
                  />
                </div>

                {isExpanded && (
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
                    )}
                  >
                    <p className="text-sm font-medium text-white">{name || "SyncFlow"}</p>
                    <p className="text-xs text-white/60">{data?.email || "syncflow@email.com"}</p>
                  </div>
                )}
              </button>
            </PopoverTrigger>

            <PopoverContent
              side="right"
              align="end"
              className="w-56 glass-card  border-white/10 p-2 rounded-2xl ml-5"
            >
              <div className="space-y-">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-white/10 text-white">
                  <Users className="w-4 h-4" />
                  Edit Profile
                </button>
                <div className="py-2">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
                <Logout/>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Toggle Button */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "mt-2 w-full hover:bg-white/10",
              !isExpanded && "justify-center"
            )}
          >
            {isExpanded ? (
              <ChevronLeft className="w-4 h-4 text-white" />
            ) : (
              <ChevronRight className="w-4 h-4 text-white" />
            )}
          </Button>
        )}
      </div>
    </aside>
  );
}
