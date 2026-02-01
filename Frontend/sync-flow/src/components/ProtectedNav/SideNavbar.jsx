import {
  LayoutDashboard,
  Users,
  Settings,
  Folder,
  MessageSquare,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/Toolltip";
import { cn } from "../../utils/utils";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useProject } from "../../hooks/useProject";
import Avatars from "./Avatar";

export function Sidebar({ isExpanded, setIsExpanded, isMobile }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { is_solo, project } = useProject();
  
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  ];

  if (project?.project_id && !is_solo) {
    navItems.push({
      icon: Users,
      label: "Team",
      to: `/teams/${project.project_id}/Projectmembers`,
    });
  }

  navItems.push(
    { icon: Folder, label: "Projects", to: "/dashboard/project" },
    { icon: MessageSquare, label: "Messages", to: "/messages" },
  );

  const bottomItems = [
    { icon: Bell, label: "Notifications", to: "/notifications" },
    { icon: Settings, label: "Settings", to: "/settings" },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !(is_solo && item.label === "Team"),
  );

  const handleNavClick = () => {
    if (isMobile) {
      setIsExpanded(false);
    }
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
        isMobile && isExpanded && "translate-x-0",
      )}
    >
      <div className="relative flex flex-col h-full bg-background/40 p-3 overflow-hidden">
        <div className="relative flex items-center justify-between h-14 mb-6">
          <div
            className={cn(
              "flex items-center",
              isExpanded ? "justify-start" : "justify-center w-full",
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
                "absolute  -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-gray-500/70 dark:border-indigo-400/30",
                "bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-indigo-500/20 transition-all duration-300 z-10",
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

        <nav className="flex-1 space-y-2">
          {filteredNavItems.map((item) => (
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
                      isExpanded ? "justify-start" : "justify-center",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-[18px] flex-shrink-0 transition-colors",
                        isActive(item.to)
                          ? "text-black/80 dark:text-indigo-300"
                          : "text-gray-800 dark:text-gray-400 group-hover:text-indigo-900 dark:group-hover:text-indigo-300",
                      )}
                    />
                    {isExpanded && (
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors",
                          isActive(item.to)
                            ? "text-black/80 dark:text-indigo-200"
                            : "text-gray-800 dark:text-gray-200 group-hover:text-indigo-900 dark:group-hover:text-indigo-200",
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

          <div className="mt-10 ">
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
                      isExpanded ? "justify-start" : "justify-center",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-[18px] flex-shrink-0 transition-colors",
                        isActive(item.to)
                          ? "text-black/80 dark:text-indigo-300"
                          : "text-gray-800 dark:text-gray-400 group-hover:text-indigo-900 dark:group-hover:text-indigo-300",
                      )}
                    />
                    {isExpanded && (
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors",
                          isActive(item.to)
                            ? "text-black/80 dark:text-indigo-200"
                            : "text-gray-800 dark:text-gray-200 group-hover:text-indigo-900 dark:group-hover:text-indigo-200",
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

        <Avatars
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          isMobile={isMobile}
          open={open}
          setOpen={setOpen}
        />
      </div>
    </aside>
  );
}
