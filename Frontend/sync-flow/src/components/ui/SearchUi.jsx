import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Search, User, ClipboardList, FolderOpen } from "lucide-react"; // ← Added icons for types
import debounce from "lodash.debounce";
import { useQuery } from "@tanstack/react-query";
import { globalSearch } from "../../api/search";

export default function SearchUI() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const navigate = useNavigate();

  // Debounce setup
  const debouncedSetQuery = useMemo(
    () =>
      debounce((value) => {
        const trimmed = value.trim();
        setDebouncedQuery(trimmed);
      }, 250),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSetQuery(value);
  };

  // TanStack Query
  const {
    data: rawData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["globalSearch", debouncedQuery],
    queryFn: () => globalSearch({ q: debouncedQuery }),
    enabled: debouncedQuery.length >= 1,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Combine all results with types
  const searchResults = [
    ...(rawData?.projects?.map(item => ({ ...item, type: "project" })) || []),
    ...(rawData?.tasks?.map(item => ({ ...item, type: "task" })) || []),
    ...(rawData?.members?.map(item => ({ ...item, type: "member" })) || []),

  ];
  console.log("Search Results:", searchResults);  

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Prevent body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Dynamic icon based on type
  const getIcon = (type) => {
    switch (type) {
      case "project":
        return <FolderOpen size={16} className="text-blue-600 dark:text-blue-400" />;
      case "task":
        return <ClipboardList size={16} className="text-green-600 dark:text-green-400" />;
      case "member":
        return <User size={16} className="text-purple-600 dark:text-purple-400" />;
      default:
        return <Search size={16} className="text-gray-600 dark:text-gray-400" />;
    }
  };

  // Dynamic navigation based on type
  const handleClick = (item) => {
    setOpen(false);
    switch (item.type) {
      case "project":
        navigate(`/projects/${item.id}`);
        break;
      case "task":
        navigate(`/tasks/${item.id}`);
        break;
      case "member":
        navigate(`/users/${item.id}`); 
        break;
  
      default:
        console.log("Unknown type:", item.type);
    }
  };

  const searchModal = (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 dark:bg-black/20 bg-[#66b3ff0d] backdrop-blur-[5px] saturate-150 animate-in fade-in duration-300"
      />

      {/* Modal */}
      <div className="
          relative z-[100000] w-full max-w-2xl
          rounded-2xl
          bg-[#ffffff00]
          dark:bg-[#0a0a0a8d] 
          backdrop-blur-[150px] saturate-[200%]
          shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]
          border border-white/10
          flex flex-col
          overflow-hidden
          animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300 ease-out
        ">

        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-200 dark:border-zinc-700">
          <Search size={20} className="text-blue-600 dark:text-blue-400" />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={handleInputChange}
            placeholder="Search projects, tasks, people..."
            className="flex-1 bg-transparent text-lg outline-none dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
          />
          <kbd onClick={() => setOpen(false)} className="hidden cursor-pointer sm:block px-2.5 py-1 text-xs border rounded bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-500 dark:text-zinc-400">
            esc
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {isLoading && debouncedQuery && (
            <div className="py-10 text-center text-zinc-500">Searching...</div>
          )}

          {isError && (
            <div className="py-10 text-center text-red-500">
              {error?.message || "Failed to load results"}
            </div>
          )}

          {!isLoading && !isError && debouncedQuery && searchResults.length === 0 && (
            <div className="py-10 text-center text-zinc-500">
              No results found for "{debouncedQuery}"
            </div>
          )}

          {searchResults.length > 0 && (
            <ul className="space-y-1">
              {searchResults.map((item) => (
                <li
                  key={`${item.type}-${item.id}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/70 cursor-pointer transition group"
                  onClick={() => handleClick(item)}
                >
                  <div className="w-9 h-9 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    {getIcon(item.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-zinc-900 flex gap-1 items-center dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.name || item.title || "Unnamed"}
                      <div className="text-xs text-black/60 bg-transparent inline px-2 py-1 rounded-lg backdrop-white/10 dark:text-zinc-400 mt-0.5 line-clamp-1">
                        {item.is_solo !== undefined ? (item.is_solo ? "(Solo Project)" : "(Team Project)") : item.project_name ? `Project: ${item.project_name}` : ""}
                      </div>
                    </div>
                    
                    {item.description && (
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                        {item.description} 
                      </div>
                    )}
                    <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 capitalize">
                      {item.type}
                    </div>
                    
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop trigger */}
      <div className="hidden sm:block w-full max-w-md">
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-1.5 rounded-lg border bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all"
        >
          <Search size={16} className="text-blue-600 dark:text-blue-400" />
          <span className="flex-1 text-left text-sm text-zinc-600 dark:text-zinc-300">
             Search...
          </span>
          <kbd className="text-xs px-2 py-1 rounded border bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Mobile trigger */}
      <div className="sm:hidden">
        <button
          onClick={() => setOpen(true)}
          className="p-3 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800"
          aria-label="Open global search"
        >
          <Search size={18} className="text-blue-600 dark:text-blue-400" />
        </button>
      </div>

      {open && createPortal(searchModal, document.body)}
    </>
  );
}