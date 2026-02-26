
import React, { useState } from 'react'
import { AlertCircle, Archive, Trash2, Trash } from 'lucide-react'
import { button  } from '../../components/ui/button'
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

export function DangerZone() {
  const [showArchiveDialog, setShowArchiveDialog] = useState(false)
  const [showSoftDeleteDialog, setShowSoftDeleteDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleArchive = () => {
    console.log('Project archived')
    setShowArchiveDialog(false)
  }

  const handleSoftDelete = () => {
    console.log('Project soft deleted (moved to trash)')
    setShowSoftDeleteDialog(false)
  }

  const handleDelete = () => {
    console.log('Project deleted permanently')
    setShowDeleteDialog(false)
  }

  return (
    <div className="lg:sticky lg:top-8 lg:h-fit">
      <div
        className="rounded-lg sm:rounded-2xl border-2 border-red-200 bg-red-50 p-3 sm:p-4 md:p-6 shadow-lg"
        style={{ backgroundColor: 'var(--danger-bg)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="p-1.5 sm:p-2 rounded-lg bg-red-100 flex-shrink-0">
            <AlertCircle size={18} className="text-red-600 sm:size-5" />
          </div>
          <h3 className="font-semibold text-foreground text-sm sm:text-base">
            Danger Zone
          </h3>
        </div>

        {/* Warning text */}
        <p className="text-xs text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
          These actions are permanent and irreversible. Please be careful.
        </p>

        {/* Divider */}
        <div className="h-px bg-red-200 mb-3 sm:mb-4" />

        {/* Archive button */}
        <button
          onClick={() => setShowArchiveDialog(true)}
          className="w-full mb-2 sm:mb-3 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-medium transition-colors text-xs sm:text-sm active:scale-95"
        >
          <Archive size={16} className="flex-shrink-0" />
          <span>Archive</span>
        </button>

        {/* Soft Delete button */}
        <button
          onClick={() => setShowSoftDeleteDialog(true)}
          className="w-full mb-2 sm:mb-3 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium transition-colors text-xs sm:text-sm active:scale-95"
        >
          <Trash size={16} className="flex-shrink-0" />
          <span>Move to Trash</span>
        </button>

        {/* Delete button */}
        <button
          onClick={() => setShowDeleteDialog(true)}
          className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors text-xs sm:text-sm shadow-md active:scale-95"
        >
          <Trash2 size={16} className="flex-shrink-0" />
          <span>Delete Permanently</span>
        </button>

        {/* Footer info */}
        <p className="text-xs text-muted-foreground mt-3 sm:mt-4 italic">
          Last modified: Today at 2:34 PM
        </p>
      </div>

      {/* Soft Delete Dialog */}
      <AlertDialog open={showSoftDeleteDialog} onOpenChange={setShowSoftDeleteDialog}>
        <AlertDialogContent className="rounded-2xl bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash className="text-orange-600" size={20} />
              Move to Trash?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              This project will be moved to trash. You can restore it from trash within 30 days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSoftDelete}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Move to Trash
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Archive Dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent className="rounded-2xl bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 ">
              <Archive className="text-yellow-600" size={20} />
              Archive Project?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              This project will be archived and moved to your archive. You can restore it anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchive}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-2xl bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="text-red-600" size={20} />
              Delete Permanently?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              This action cannot be undone. The project and all its data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}