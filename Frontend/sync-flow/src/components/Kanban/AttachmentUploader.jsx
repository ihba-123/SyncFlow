import { useRef, useId, useState } from "react";
import { useKanban } from "../../stores/KanbanStore";
import { attachmentService } from "../../api/khanban_api"; // Your API service
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

// ── Stable key for attachments ───────────────────────────────
const attKey = (att) => (att.file ? `${att.name}-${att.file.size}` : att.name);

// ── File type icons ──────────────────────────────────────────
const FILE_ICONS = {
  image: ["png", "jpg", "jpeg", "gif", "webp", "svg"],
  pdf: ["pdf"],
  zip: ["zip", "tar", "gz", "rar", "7z"],
  db: ["sql", "db", "sqlite"],
};

function getFileIcon(name = "") {
  const ext = name.split(".").pop().toLowerCase();
  if (FILE_ICONS.image.includes(ext)) return "🖼";
  if (FILE_ICONS.pdf.includes(ext)) return "📄";
  if (FILE_ICONS.zip.includes(ext)) return "📦";
  if (FILE_ICONS.db.includes(ext)) return "🗄";
  return "📎";
}

export default function AttachmentUploader({ attachments = [], onChange, taskId, colId }) {
  const inputRef = useRef(null);
  const inputId = useId(); // stable id for label
  const { project_id } = useParams();
  const [uploading, setUploading] = useState(false);

  // ── Mutation to upload attachment to backend ───────────────
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      return attachmentService(taskId, project_id, file);
    },
    onSuccess: (newAttachment) => {
      // Add uploaded attachment to local state
      onChange((prev) => [...prev, newAttachment]);
    },
    onError: (err) => {
      console.error("Attachment upload failed:", err);
    },
  });

  // ── Handle new files added ───────────────────────────────
  const handleFiles = async (e) => {
    const incoming = Array.from(e.target.files ?? []);
    const existingNames = new Set(attachments.map((a) => a.name));
    const newFiles = incoming.filter((f) => !existingNames.has(f.name));

    if (!newFiles.length) return;

    if (!taskId) {
      // For new tasks, stage attachments locally in one update.
      onChange((prev) => [...prev, ...newFiles.map((f) => ({ name: f.name, file: f }))]);
      e.target.value = "";
      return;
    }

    setUploading(true);

    for (const file of newFiles) {
      // Upload file to backend if task exists
      await uploadMutation.mutateAsync(file);
    }

    setUploading(false);
    e.target.value = ""; // allow re-adding same file
  };

  // ── Remove attachment ─────────────────────────────────────
  const removeAttach = (key) => {
    onChange((prev) => prev.filter((a) => attKey(a) !== key));
  };

  return (
    <div className="space-y-2">
      {/* Dropzone / Click area */}
      <label
        htmlFor={inputId}
        className="flex flex-col items-center gap-1 border-2 border-dashed border-slate-700
          rounded-xl p-4 text-center cursor-pointer select-none
          transition-all duration-200
          hover:border-indigo-500/60 hover:bg-indigo-500/5
          focus-within:border-indigo-500/60 focus-within:bg-indigo-500/5
          group"
      >
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          multiple
          className="sr-only"
          onChange={handleFiles}
          aria-label="Attach files"
        />
        <span className="text-lg text-slate-500 group-hover:text-indigo-400 transition-colors" aria-hidden="true">
          {uploading ? "⏳" : "📎"}
        </span>
        <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
          {uploading ? "Uploading..." : "Click to attach files"}
        </span>
      </label>

      {/* Attachment list */}
      {attachments.length > 0 && (
        <ul className="space-y-1.5" role="list">
          {attachments.map((att) => {
            const key = attKey(att);
            return (
              <li key={key} className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2 group/att">
                <span className="text-sm shrink-0" aria-hidden="true">
                  {getFileIcon(att.name)}
                </span>
                <span className="text-xs text-slate-400 flex-1 truncate" title={att.name}>
                  {att.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeAttach(key)}
                  aria-label={`Remove ${att.name}`}
                  className="opacity-0 group-hover/att:opacity-100 shrink-0
                    w-5 h-5 flex items-center justify-center rounded
                    text-slate-600 hover:text-rose-400 hover:bg-rose-500/10
                    transition-all text-xs focus:opacity-100 focus:outline-none
                    focus:ring-1 focus:ring-rose-500/50"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}