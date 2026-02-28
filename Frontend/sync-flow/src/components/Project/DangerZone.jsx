import React, { useState } from 'react'
import { AlertCircle, Archive, Trash2, Trash } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/AlertDialog'
import { deleteProject, softDeleteProject } from '../../api/Project'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setActiveProjects } from '../../api/active_project'
import { useActiveProjectStore } from '../../stores/ActiveProject'

export function DangerZone({ projectId }) {
  const [showArchiveDialog, setShowArchiveDialog] = useState(false)
  const [showSoftDeleteDialog, setShowSoftDeleteDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { id } = useParams()
  const resetActiveProject = useActiveProjectStore((state) => state.reset);
  // Archive placeholder
  const handleArchive = () => { 
    console.log('Project archived'); 
    setShowArchiveDialog(false) 
    toast.success('Project archived successfully!') 
  }

  // Soft Delete mutation
  const { mutate: handleSoftDelete, isLoading: softDeleting } = useMutation({
    mutationFn: () => softDeleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setShowSoftDeleteDialog(false)
      toast.success('Project moved to trash successfully!')
    },
    onError: (error) => {
      console.error('Failed to soft delete project:', error)
      toast.error('Failed to move project to trash.')
    },
  })

  // Permanent Delete mutation
  const { mutate: handlePermanentDelete, isLoading: deleting } = useMutation({
    mutationFn: () => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['projectDetails'] })
      queryClient.invalidateQueries({ queryKey: ['activeProject'] })
      resetActiveProject(); 
      setShowDeleteDialog(false)
      toast.success('Project deleted permanently!')
      navigate('/dashboard') // redirect after delete
    },
    onError: (error) => {
      console.error('Failed to delete project:', error)
      toast.error('Failed to delete project.')
    },
  })

  return (
    <div className="lg:sticky lg:top-8 lg:h-fit">
      <div className="rounded-lg sm:rounded-2xl border-2 border-red-200 bg-red-50 dark:bg-red-900 p-3 sm:p-4 md:p-6 shadow-lg">
        {/* Header */}
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

        {/* Archive Button */}
        <button
          onClick={() => setShowArchiveDialog(true)}
          className="w-full mb-2 h-14 sm:h-11.5 sm:mb-3 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-yellow-100 dark:bg-yellow-800 hover:bg-yellow-200 dark:hover:bg-yellow-700 text-yellow-700 dark:text-yellow-200 font-medium transition-colors text-xs sm:text-sm active:scale-95"
        >
          <Archive size={19} className="flex-shrink-0" />
          <span className='text-sm sm:text-sm'>Archive</span>
        </button>

        {/* Soft Delete Button */}
        <button
          onClick={() => setShowSoftDeleteDialog(true)}
          className="w-full mb-2 sm:mb-3 h-14 sm:h-11.5 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-orange-100 dark:bg-orange-800 hover:bg-orange-200 dark:hover:bg-orange-700 text-orange-700 dark:text-orange-200 font-medium transition-colors text-xs sm:text-sm active:scale-95"
        >
          <Trash size={19} className="flex-shrink-0" />
          <span className='text-sm sm:text-sm'>{softDeleting ? 'Moving...' : 'Move to Trash'}</span>
        </button>

        {/* Delete Permanently Button */}
        <button
          onClick={() => setShowDeleteDialog(true)}
          className="w-full flex items-center h-14 sm:h-11.5 justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-medium transition-colors text-xs sm:text-sm shadow-md active:scale-95"
        >
          <Trash2 size={19} className="flex-shrink-0" />
          <span className='text-sm sm:text-sm'>{deleting ? 'Deleting...' : 'Delete Permanently'}</span>
        </button>

        <p className="text-xs text-muted-foreground dark:text-gray-300 mt-3 sm:mt-4 italic">
          Last modified: Today at 2:34 PM
        </p>
      </div>

      {/* Archive Dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent className="rounded-2xl bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Archive className="text-yellow-600 dark:text-yellow-400" size={20} />
              Archive Project?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base dark:text-gray-300">
              This project will be archived. You can restore it anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchive}
              className="bg-yellow-600 h-11 sm:h-9.5 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600"
            >
              Archive
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
              This project will be moved to trash. You can restore it from trash within 30 days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleSoftDelete(projectId)}
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
              onClick={() => handlePermanentDelete(projectId)}
              className="bg-red-600 h-11 sm:h-9.5 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              {deleting ? "Deleting..." : "Delete Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}