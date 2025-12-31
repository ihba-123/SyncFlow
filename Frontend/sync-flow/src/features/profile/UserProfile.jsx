import { useState } from "react";
import { useAuth } from "../../hooks/Auth";
import { useUserProfile } from "../../hooks/UserProfile";
import { Mail, Calendar, Edit3 } from "lucide-react";
import {Link} from "react-router-dom"
import UserProfileSkeleton from "../../components/skeleton/UserProfileSkeleton";
export default function UserProfile() {
  const { data: authData } = useAuth();
  const { name, photo, bio , isLoading } = useUserProfile();

  const displayName = name || authData?.name;
  const initials = displayName.charAt(0).toUpperCase();
  const email = authData?.email || "abhishekbhatta110@gmail.com";
  const userBio = bio || "No bio yet. Click Edit Profile to add one.";


  if (isLoading) return <UserProfileSkeleton />;


  return (
    
    <div className="min-h-screen py-6 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="bg-background/30 backdrop-blur-md   rounded-xl border shadow-lg border-gray-300  dark:border-gray-800 overflow-hidden">
          
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 lg:gap-8">
              
              <div className="relative group shrink-0">
                {authData?.photo || photo ? (
                  <img
                    src={authData?.photo || photo}
                    alt={displayName}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full  object-cover border-4 dark:border-gray-500 border-white/10"
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-cyan-500 flex items-center justify-center text-4xl sm:text-5xl font-bold text-white border-4 border-gray-800">
                    {initials}
                  </div>
                )}

                <label className="absolute inset-0 rounded-full cursor-pointer"></label>
              </div>

              
              <div className="flex-1 text-center sm:text-left w-full">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="max-w-2xl">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-black/80 dark:text-white mb-1">
                      {displayName}
                    </h1>

                   
                    {userBio && (

                      <p className="dark:text-gray-600 text-gray-900  mb-6 leading-relaxed">
                        {userBio}
                      </p>
                    )}

                    {/* Email & Join Date */}
                    <div className="space-y-3 text-left">
                      <div className="flex items-center gap-3 text-gray-700  dark:text-gray-500">
                        <Mail className="w-5 text-gray-950 dark:text-white h-5 flex-shrink-0" />
                        <span className="text-sm break-all">{email}</span>
                      </div>
                    </div>
                  </div>

                  <Link to="/dashboard/edit-profile"
                    className="flex cursor-pointer backdrop-blur-3xl items-center justify-center gap-2 px-4 py-1 h-10 
                               border dark:border-gray-700 border-gray-400 hover:bg-gray-300 dark:hover:bg-gray-900 text-gray-800 dark:text-white 
                                text-sm font-medium rounded-sm 
                                transition-all duration-200 active:scale-95 
                                whitespace-nowrap"
                  >
                    <Edit3 className="w-3 h-3 text- flex-shrink-0" />
                    <span>Edit Profile</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
