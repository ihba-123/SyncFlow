import { useRef, useId } from "react";

// Stable key: use file name + size (size distinguishes same-name different files)
const attKey = (att) => att.file ? `${att.name}-${att.file.size}` : att.name;

const FILE_ICONS = {
  image: ["png", "jpg", "jpeg", "gif", "webp", "svg"],
  pdf:   ["pdf"],
  zip:   ["zip", "tar", "gz", "rar", "7z"],
  db:    ["sql", "db", "sqlite"],
};

function getFileIcon(name = "") {
  const ext = name.split(".").pop().toLowerCase();
  if (FILE_ICONS.image.includes(ext)) return "🖼";
  if (FILE_ICONS.pdf.includes(ext))   return "📄";
  if (FILE_ICONS.zip.includes(ext))   return "📦";
  if (FILE_ICONS.db.includes(ext))    return "🗄";
  return "📎";
}

export default function AttachmentUploader({ attachments = [], onChange }) {
  const inputRef = useRef(null);
  const inputId  = useId(); // stable id for label association

  const handleFiles = (e) => {
    const incoming = Array.from(e.target.files ?? []);
    const existingNames = new Set(attachments.map((a) => a.name));
    const newAtts = incoming
      .filter((f) => !existingNames.has(f.name))
      .map((f) => ({ name: f.name, file: f }));

    if (newAtts.length) onChange([...attachments, ...newAtts]);
    // Reset so same file can be re-added after removal
    e.target.value = "";
  };

  const removeAttach = (key) => {
    onChange(attachments.filter((a) => attKey(a) !== key));
  };

  return (
    <div className="space-y-2">
      {/* Drop zone / click target */}
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
        <span className="text-lg text-slate-500 group-hover:text-indigo-400 transition-colors"
          aria-hidden="true">
          📎
        </span>
        <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
          Click to attach files
        </span>
      </label>

      {/* Attachment list */}
      {attachments.length > 0 && (
        <ul className="space-y-1.5" role="list">
          {attachments.map((att) => {
            const key = attKey(att);
            return (
              <li
                key={key}
                className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2 group/att"
              >
                <span className="text-sm flex-shrink-0" aria-hidden="true">
                  {getFileIcon(att.name)}
                </span>
                <span className="text-xs text-slate-400 flex-1 truncate" title={att.name}>
                  {att.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeAttach(key)}
                  aria-label={`Remove ${att.name}`}
                  className="opacity-0 group-hover/att:opacity-100 flex-shrink-0
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
