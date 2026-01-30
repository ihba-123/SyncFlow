import React, { useState } from "react";
import {
  Shield,
  User,
  Eye,
  Copy,
  Check,
  Sparkles,
  X,
  Globe,
  Lock,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import InvitePageDetail from "./InvitePageDetail";
import { useMutation } from "@tanstack/react-query";
import { inviteLink } from "../../api/invite_join";
import { useParams } from "react-router-dom";
import { useProject } from "../../hooks/useProject";

const InvitePage = () => {
  const [selectedRole, setSelectedRole] = useState("member");
  const [showModal, setShowModal] = useState();
  const [copied, setCopied] = useState(false);
  const [datas, setDatas] = useState();
  const {project} = useProject();
  const { project_id } = useParams();
  const roles = [
    { id: "admin", icon: <Shield size={14} /> },
    { id: "member", icon: <User size={14} /> },
    { id: "viewer", icon: <Eye size={14} /> },
  ];

  //Handeling invites

  const mutation = useMutation({
    mutationFn: inviteLink,
    onSuccess: (data) => {
      setShowModal(true);
      setDatas(data);
    },
    onError: (err) => {
      console.error("Invite error:", err.response?.data);
    },
  });

  const handleInvite = () => {
    mutation.mutate({
      project_id: project_id || project.id,
      role: selectedRole,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(datas?.invite_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen w-full  text-slate-900 dark:text-slate-200 font-sans selection:bg-blue-900/30 transition-colors duration-500 flex flex-col overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[100px] opacity-20 bg-blue-400 transition-colors duration-1000" />
      </div>

      <header className="relative z-10 w-full pt-20 -mt-10 md:-mt-22 md:pt-32 md:pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm"
          >
            <ShieldCheck size={14} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Access Protocol
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-black tracking-tight text-slate-800 dark:text-white leading-[0.9]"
          >
            Team Invitation
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Assign a role to generate a secure invitation link{" "}
            <br className="hidden md:block" /> for your project collaborators.
          </motion.p>
        </div>
      </header>

      {/* CHOOSE SECTION */}
      <main className="relative z-10 w-full flex-1 flex flex-col items-center px-6 pb-20">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-3 md:-mt-12">
            <div className="flex items-center justify-between px-2 my-6 md:my-3 md:px-0 ">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-600 ">
                Select Role
              </span>
            </div>

            <div className="grid grid-cols-3 p-1.5 bg-slate-200/50 dark:bg-white/5 backdrop-blur-xl border border-slate-300 dark:border-white/10 rounded-2xl">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`relative flex items-center justify-center  gap-2 py-3.5 rounded-xl text-xs font-bold transition-all duration-300
                    ${
                      selectedRole === role.id
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-600 hover:text-slate-600 dark:hover:text-slate-300"
                    }`}
                >
                  {selectedRole === role.id && (
                    <motion.div
                      layoutId="activeRole"
                      className="absolute inset-0 bg-white dark:bg-white/10 shadow-lg dark:shadow-none rounded-xl border border-slate-500/50 dark:border-white/10"
                    />
                  )}
                  <span className="relative z-10">{role.icon}</span>
                  <span className="relative z-10 tracking-tight">
                    {role.id}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col items-center gap-6">
            <button
              onClick={handleInvite}
              disabled={mutation.isPending}
              className="group  flex items-center justify-center  w-auto px-5 py-3 bg-gray-900 cursor-pointer dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl shadow-2xl transition-all"
            >
              {mutation.isPending ? "Generating..." : "Generate Invitation"}
              <ArrowRight size={18} />
            </button>

            <div className="flex items-center gap-6 opacity-40">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                <Lock size={12} /> E2E Encrypted
              </div>
            </div>
          </div>
        </div>
      </main>

      <InvitePageDetail
        showModal={showModal}
        setShowModal={setShowModal}
        selectedRole={selectedRole}
        handleCopy={handleCopy}
        copied={copied}
        Copy={Copy}
        Check={Check}
        datas={datas}
      />

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#020617] border border-slate-700 rounded-full px-5 py-2.5 shadow-xl z-[100]"
          >
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-white whitespace-nowrap">
              Copied to clipboard
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvitePage;
