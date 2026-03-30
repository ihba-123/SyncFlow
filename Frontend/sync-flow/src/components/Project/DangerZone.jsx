import React, { useState } from "react";
import { AlertCircle, Trash, Trash2, LogOut } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/AlertDialog";
import { deleteProject, softDeleteProject } from "../../api/Project";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useActiveProjectStore } from "../../stores/ActiveProject";
import { useProjectRoleStore } from "../../stores/ProjectRoleStore";
import useProjectSocket from "../../hooks/useProjectSocket"; // WebSocket hook

export function DangerZone({ projectId, currentUser }) {
  const [showSoftDeleteDialog, setShowSoftDeleteDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [leaveProject, setLeaveProject] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const resetActiveProject = useActiveProjectStore((state) => state.reset);
  const { isAdmin } = useProjectRoleStore();

  // WebSocket connection for real-time updates
  useProjectSocket(projectId, (data) => {
    if (data.action === "project_deleted") {
      toast.info("This project was deleted!");
      resetActiveProject();
      navigate("/dashboard");
    }

    if (data.action === "member_removed" && data.target_user_id === currentUser.id) {
      toast.info("You were removed from this project!");
      resetActiveProject();
      navigate("/dashboard");
    }

    if(data.action === "project_restored") {
      toast.info("This project was restored!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    }

    if(data.action === "leave_project" && data.target_user_id === currentUser.id) {
      toast.info("You left the project!");
      resetActiveProject();
      navigate("/dashboard");
    }
  });


  // Leave Project / Soft Delete mutation
  const { mutate: handleSoftDelete, isLoading: softDeleting } = useMutation({
    mutationFn: () => softDeleteProject(projectId),
    onSuccess: () => {
      resetActiveProject();
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["members", projectId] });
      navigate("/dashboard");
      toast.success("You left or moved project to trash successfully!");
      setLeaveProject(false);
      setShowSoftDeleteDialog(false);
    },
    onError: () => {
      toast.error("Failed to leave/move project.");
    },
  });


  // Permanent Delete mutation
  const { mutate: handlePermanentDelete, isLoading: deleting } = useMutation({
    mutationFn: () => deleteProject(projectId),
    onSuccess: () => {
      resetActiveProject();
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["members", projectId] });
      navigate("/dashboard");
      toast.success("Project deleted permanently!");
      setShowDeleteDialog(false);
    },
    onError: () => {
      toast.error("Failed to delete project.");
    },
  });

  if (!isAdmin) return null;

  return (
    <div className="lg:sticky lg:top-8 lg:h-fit">
      {/* Danger Zone Header */}
      <div className="rounded-lg sm:rounded-2xl border-2 dark:border-gray-800 border-gray-200 p-3 sm:p-4 md:p-6 shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="p-1.5 sm:p-2 rounded-lg bg-red-100 dark:bg-red-800 flex-shrink-0">
            <AlertCircle size={18} className="text-red-600 sm:size-5" />
          </div>
          <h3 className="font-semibold text-foreground dark:text-white text-sm sm:text-base">
            Danger Zone
          </h3>
        </div>
        <p className="text-xs text-muted-foreground dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed">
          These actions are permanent and irreversible. Please be careful.
        </p>
        <div className="h-px bg-red-200 dark:bg-red-700 mb-3 sm:mb-4" />

        {/* Leave Project Button */}
        <button
          onClick={() => setLeaveProject(true)}
          className="w-full mb-2 sm:mb-3 h-14 sm:h-11.5 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-orange-100 dark:bg-orange-200 hover:bg-orange-200 dark:hover:bg-orange-300 text-orange-700 dark:text-black font-medium transition-colors text-xs sm:text-sm active:scale-95"
        >
          <LogOut size={19} className="flex-shrink-0" />
          <span>{softDeleting ? "Leaving..." : "Leave Project"}</span>
        </button>

        {/* Soft Delete / Move to Trash Button */}
        <button
          onClick={() => setShowSoftDeleteDialog(true)}
          className="w-full mb-2 sm:mb-3 h-14 sm:h-11.5 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-red-700 hover:bg-red-500 text-white dark:text-orange-200 font-medium transition-colors text-xs sm:text-sm active:scale-95"
        >
          <Trash size={19} className="flex-shrink-0" />
          <span>{softDeleting ? "Moving..." : "Move to Trash"}</span>
        </button>

        {/* Permanent Delete Button */}
        <button
          onClick={() => setShowDeleteDialog(true)}
          className="w-full flex items-center h-14 sm:h-11.5 justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-medium transition-colors text-xs sm:text-sm shadow-md active:scale-95"
        >
          <Trash2 size={19} className="flex-shrink-0" />
          <span>{deleting ? "Deleting..." : "Delete Permanently"}</span>
        </button>
      </div>

      {/* Leave Project Dialog */}
      <AlertDialog open={leaveProject} onOpenChange={setLeaveProject}>
        <AlertDialogContent className="rounded-2xl bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <LogOut className="text-orange-600 dark:text-orange-400" size={20} />
              Leave Project?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base dark:text-gray-300">
              After leaving, you will not be able to join the project without admin approval!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleSoftDelete()}
              className="bg-orange-600 h-11 sm:h-9.5 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600"
            >
              {softDeleting ? "Leaving..." : "Leave Project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Soft Delete Dialog */}
      <AlertDialog open={showSoftDeleteDialog} onOpenChange={setShowSoftDeleteDialog}>
        <AlertDialogContent className="rounded-2xl bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash className="text-orange-600 dark:text-orange-400" size={20} />
              Move to Trash?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base dark:text-gray-300">
              This project will be moved to trash. You can restore it within 30 days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleSoftDelete()}
              className="bg-orange-600 h-11 sm:h-9.5 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600"
            >
              {softDeleting ? "Moving..." : "Move to Trash"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-2xl bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="text-red-600 dark:text-red-400" size={20} />
              Delete Permanently?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base dark:text-gray-300">
              This action cannot be undone. The project and all its data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handlePermanentDelete()}
              className="bg-red-600 h-11 sm:h-9.5 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              {deleting ? "Deleting..." : "Delete Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}