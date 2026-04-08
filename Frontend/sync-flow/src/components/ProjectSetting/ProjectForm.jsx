import { Camera, Save } from "lucide-react";
import React from "react";

const ProjectForm = ({ form, setForm, canEdit, saveMutation, previewUrl, handleSubmit, handleImageChange, handleRemoveImage, handleResetChanges , imageFile , isDirty }) => {
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="rounded-sm border border-slate-200 bg-white/90 p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900/80"
      >
        <div className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Project Name
            </label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              disabled={!canEdit || saveMutation.isPending}
              className="w-full rounded-sm border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              disabled={!canEdit || saveMutation.isPending}
              rows={5}
              className="w-full resize-none rounded-sm border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              placeholder="Write project description"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Project Image
            </label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-sm border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Project preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    No image
                  </div>
                )}
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm hover:scale-105 border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                <Camera className="h-4 w-4" />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  disabled={!canEdit || saveMutation.isPending}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={
                  !canEdit ||
                  saveMutation.isPending ||
                  (!previewUrl && !imageFile)
                }
                className="rounded-sm hover:scale-105 cursor-pointer border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/50 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                Remove Image
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
            <button
              type="submit"
              disabled={!canEdit || saveMutation.isPending}
              className="inline-flex items-center gap-2  rounded-sm hover:scale-102 bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900"
            >
              <Save className="h-4 w-4" />
              {saveMutation.isPending ? "Saving..." : "Save Settings"}
            </button>
            <button
              type="button"
              onClick={handleResetChanges}
              disabled={saveMutation.isPending || !isDirty}
              className="inline-flex items-center gap-2 rounded-sm border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
            >
              Reset
            </button>
            {!canEdit && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Only project admin can edit these settings.
              </p>
            )}
            {isDirty && (
              <p className="text-xs text-sky-600 dark:text-sky-300">
                You have unsaved changes.
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
