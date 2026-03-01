import React, { useEffect, useState } from "react";
import { FiCopy, FiUserPlus, FiMoreVertical } from "react-icons/fi";
import { useTeamList } from "./TeamListLogic";
import { TeamViewSkeleton } from "../../components/skeleton/ProjectMemberSkeleton";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/Auth";
import { useProjectRoleStore } from "../../stores/ProjectRoleStore";
import { useActiveProjectStore } from "../../stores/ActiveProject";

const TeamView = () => {
  const [showToast, setShowToast] = useState(false);
  const { id } = useParams();
  const { data, isLoading, isError } = useTeamList(id); 
  const { setRole, isAdmin } = useProjectRoleStore();
  const { data: authData } = useAuth();
  const { activeProject } = useActiveProjectStore();
 
const invites = data?.invites || [];
const joined_members = data?.joined_members || [];
  //Admin role logic
  useEffect(() => {
    if (!joined_members.length || !authData?.id) return;

    const myRole = joined_members.find(
      (member) => member.id === authData.id,
    )?.role;
    if (myRole === "Admin" || myRole === "Member" && myRole ) {
      setRole(myRole);
    }
  }, [joined_members, authData, setRole]);





  //Date formatting function
  const formatShortDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  //Copy to the clipboard function
  const copyToClipboard = async (token) => {
    if (typeof token !== "string") return;

    try {
      await navigator.clipboard.writeText(token);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  if (isLoading) {
    return (
      <TeamViewSkeleton
        membersLength={joined_members?.length || 3}
        invitesLength={invites?.length || 2}
      />
    );
  }

  if ( activeProject && activeProject.id === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0c14] p-6">
        <div className="max-w-md w-full text-center">
          <div className="text-7xl mb-6">🏗️</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            Loading team members...
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Please wait while we load the team members for the selected project.
          </p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen -mt-5 bg-slate-50 text-slate-900 dark:bg-[#0a0c14] dark:text-slate-100">
      {/* Toast notification */}
      {showToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-card/10 backdrop-blur-sm border  border-black/20 dark:border-white/10 border-l-0 transition-all duration-300 dark:text-white text-gray-700 shadow-lg">
            <FiCopy size={16} />
            <span className="text-sm  text-gray-700 dark:text-gray-200 font-bold">
              Copied to clipboard
            </span>
          </div>
        </div>
      )}
      <div className="fixed inset-0 pointer-events-none hidden dark:block">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-transparent to-indigo-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.08)_0%,transparent_40%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-7  rounded-full text-gray-300 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="hover:underline decoration-dotted underline-offset-8 text-blue-600 dark:text-blue-300">
            <h1
              className=" text-5xl font-extrabold sm:text-3xl md:text-4xl  tracking-tight
            bg-gradient-to-r from-blue-600 to-gray-600
            dark:from-blue-100 dark:to-indigo-200 
            bg-clip-text text-transparent"
            >
              Team {isAdmin && "& Invites"}
            </h1>
          </div>

        </div>

        <div className="mb-14">
          <h2 className="mb-4 text-lg sm:text-xl font-medium text-slate-700 dark:text-slate-200">
            Active Members ·{" "}
            <span className="text-slate-400">{joined_members.length}</span>
          </h2>

          <div className="space-y-4">
            {joined_members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5
                  rounded-2xl bg-white border border-slate-300
                  shadow-sm hover:shadow-md transition
                  dark:bg-white/[0.03] dark:border-white/5 dark:hover:shadow-blue-900/10 p-4 sm:p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-full ring-1 ring-slate-300 dark:ring-white/10">
                      <img
                        src={member.photo ||  `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff&size=128`}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {member.is_online? (
                      <span
                        className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full
                        bg-emerald-500 border-2 border-white dark:border-[#0a0c14]"
                      />
                    ):(
                      <span
                        className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full
                        bg-gray-500 border-2 border-white dark:border-[#0a0c14]"
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium truncate">
                        {member.name}
                      </span>
                      <span
                        className="text-xs uppercase px-2 py-0.5 rounded-full
                        bg-blue-100 text-blue-700
                        dark:bg-blue-950/60 dark:text-blue-300"
                      >
                        {member.role}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {member.email}
                    </div>
                  </div>
                </div>

                <div className="flex sm:ml-auto items-center justify-between sm:justify-end gap-4">
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-right">
                    <div className="uppercase">Joined</div>
                    <div className="font-medium text-slate-700 dark:text-slate-300">
                      {formatShortDate(member.joined_at)}
                    </div>
                  </div>

                  <button
                    className="p-2 rounded-lg text-slate-500
                    hover:bg-slate-100 shadow-sm
                    dark:hover:bg-white/5 transition"
                  >
                    <FiMoreVertical size={18} />
                  </button>
                </div>
              </div>  
            ))}
          </div>
        </div>

        {isAdmin ? (
          <div>
            <h2 className="mb-4 text-lg sm:text-xl font-medium text-slate-700 dark:text-slate-200">
              Invitations & Links ·{" "}
              <span className="text-slate-400">{invites.length}</span>
            </h2>

            <div className="space-y-4">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="rounded-2xl bg-white border border-slate-300
                  shadow-sm hover:shadow-md transition
                  dark:bg-white/[0.04] dark:border-white/6 p-4 sm:p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">
                          {invite.invited_email || "Open invite link"}
                        </span>
                        <span
                          className="text-xs uppercase px-2 py-0.5 rounded-full
                        bg-blue-100 text-blue-700
                        dark:bg-blue-950/60 dark:text-blue-300"
                        >
                          {invite.role}
                        </span>
                        <div
                          className={`ml-3 px-2 py-0.5 text-xs font-semibold rounded-full 
                      ${
                      invite.is_used
                      ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                      : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                      }`}
                        >
                          {invite.is_used ? "Used" : "Unused"}
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-4">
                        <span>
                          Created: {formatShortDate(invite.created_at)}
                        </span>
                        <span>
                          Expires: {formatShortDate(invite.expires_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div
                        className="px-4 py-2 text-sm font-mono rounded-lg
                        bg-slate-100 border border-slate-300 shadow-inner
                        dark:bg-black/40 dark:border-white/10 dark:text-slate-300"
                      >
                        {invite.token.slice(0, 8)}...{invite.token.slice(-6)}
                      </div>

                      <button
                        onClick={() => copyToClipboard(invite.token)}
                        className="p-2 rounded-lg cursor-pointer  bg-blue-100 dark:bg-blue-900/40"
                      >
                        <FiCopy size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TeamView;










