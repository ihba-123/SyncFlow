import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { cn } from "../../utils/utils";
import Logout from "../../features/auth/Logout";
import { useUserProfile } from "../../hooks/UserProfile";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/Auth";

const Avatars = ({ isExpanded, setIsExpanded, isMobile }) => {
  const [open, setOpen] = useState(false);
  const { name, photo, is_online } = useUserProfile();
  const { data } = useAuth();
  const navigate = useNavigate();
  const handleEditProfileClick = () => {
    setOpen(false);
    if (isMobile) setIsExpanded(false);
    navigate("/dashboard/profile");
  };
  return (
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
            <div className="relative ">
              <Avatar className="w-10 h-10 cursor-pointer border-2 border-indigo-400/40">
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
  );
};

export default Avatars;
