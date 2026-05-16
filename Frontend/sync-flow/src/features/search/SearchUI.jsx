import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { SearchLogic } from "./SearchLogic";
import { Search, User, ClipboardList, FolderOpen, Settings, LayoutDashboard, Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchUI() {
  const navigate = useNavigate();
  const {
    open,
    setOpen,
    query,
    setQuery,
    handleInputChange,
    isLoading,
    isError,
    error,
    searchResults,
    recentSearches,
    handleClick,
    debouncedQuery,
    clearRecentSearches,
    setDebouncedQuery,
  } = SearchLogic();

  // Quick suggestions when search opens
  const quickSuggestions = [
    {
      category: "NAVIGATION",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", action: () => { navigate("/dashboard"); setOpen(false); } },
        { icon: FolderOpen, label: "Projects", action: () => { navigate("/dashboard/project"); setOpen(false); } },
        { icon: Users, label: "Teams", action: () => { navigate("/dashboard/project"); setOpen(false); } },
        { icon: Settings, label: "Settings", action: () => { navigate("/settings"); setOpen(false); } },
      ]
    },
    {
      category: "QUICK ACCESS",
      items: [
        {
          icon: Clock,
          label: "Recent Projects",
          action: () => {
            setQuery("project");
            setDebouncedQuery("project");
          }
        },
        {
          icon: ClipboardList,
          label: "My Tasks",
          action: () => {
            setQuery("task");
            setDebouncedQuery("task");
          }
        },
        {
          icon: User,
          label: "Team Members",
          action: () => {
            setQuery("team");
            setDebouncedQuery("team");
          }
        },
      ]
    }
  ];

  const getIcon = (type) => {
    switch (type) {
      case "project":
        return (
          <FolderOpen size={16} className="text-blue-600 dark:text-blue-400" />
        );
      case "task":
        return (
          <ClipboardList
            size={16}
            className="text-green-600 dark:text-green-400"
          />
        );
      case "member":
        return (
          <User size={16} className="text-purple-600 dark:text-purple-400" />
        );
      default:
        return (
          <Search size={16} className="text-gray-600 dark:text-gray-400" />
        );
    }
  };

  const searchModal = (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 dark:bg-black/20 bg-[#66b3ff0d] backdrop-blur-[5px] saturate-150 animate-in fade-in duration-300"
      />

      <div
        className="
          relative z-[100000] w-full max-w-4xl
          rounded-xl
          bg-[#ffffff00]
          dark:bg-[#0a0a0a8d]
          backdrop-blur-[150px] saturate-[200%]
          shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]
          border border-white/10
          flex flex-col
          overflow-hidden
          animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300 ease-out
        "
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
          <Search size={20} className="text-blue-600 dark:text-blue-400" />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={handleInputChange}
            placeholder="Search projects, tasks, people..."
            className="flex-1 bg-transparent text-lg outline-none dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
          />
          <kbd
            onClick={() => setOpen(false)}
            className="hidden cursor-pointer sm:block px-2.5 py-1 text-xs border rounded bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-500 dark:text-zinc-400"
          >
            esc
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-[70vh] overflow-y-auto">
          {/* Quick Suggestions Grid - shown when input is empty */}
          {!debouncedQuery && (
            <div className="p-6 space-y-8">
              {quickSuggestions.map((section, idx) => (
                <motion.div
                  key={section.category}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                >
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-4">
                    {section.category}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {section.items.map((item, itemIdx) => {
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={item.label}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: (idx * 0.1) + (itemIdx * 0.05), duration: 0.2 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={item.action}
                          className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-700/70 border border-zinc-200 dark:border-zinc-700 transition-all group"
                        >
                          <div className="flex flex-col items-center gap-2 text-center">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                              <Icon size={18} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                              {item.label}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                      Recent Searches
                    </h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.slice(0, 5).map((term) => (
                      <motion.button
                        key={term}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          setQuery(term);
                          setDebouncedQuery(term);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition group text-left"
                      >
                        <div className="p-2 rounded-md bg-zinc-100 dark:bg-zinc-800">
                          <Clock size={14} className="text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {term}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Loading state */}
          {isLoading && debouncedQuery && (
            <div className="py-12 text-center text-zinc-500">Searching...</div>
          )}

          {/* Error state */}
          {isError && debouncedQuery && (
            <div className="py-12 text-center text-red-500">
              {error?.message || "Failed to load results"}
            </div>
          )}

          {/* No results */}
          {!isLoading &&
            !isError &&
            debouncedQuery &&
            searchResults.length === 0 && (
              <div className="py-12 text-center text-zinc-500">
                No results found for "{debouncedQuery}"
              </div>
            )}

          {/* Search results */}
          {searchResults.length > 0 && (
            <div className="p-3">
              <ul className="space-y-1">
                {searchResults.map((item) => (
                  <motion.li
                    key={`${item.type}-${item.id}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/70 cursor-pointer transition group"
                    onClick={() => handleClick(item)}
                  >
                    <div className="w-9 h-9 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      {getIcon(item.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex gap-1 items-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.name || item.title || "Unnamed"}
                        <span className="text-xs text-black/60 dark:text-zinc-400 mt-0.5 line-clamp-1">
                          {item.is_solo !== undefined
                            ? item.is_solo
                              ? "(Solo Project)"
                              : "(Team Project)"
                            : item.project_name
                            ? `Project: ${item.project_name}`
                            : ""}
                        </span>
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
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden sm:block w-full max-w-md">
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-1.5 rounded-lg border bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all"
        >
          <Search size={16} className="text-blue-600 dark:text-blue-400" />
          <span className="flex-1 text-left text-sm text-zinc-600 dark:text-zinc-300">
            Search...
          </span>
          <kbd className="text-[10px] px-1.5 py-1 rounded border bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600">
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
