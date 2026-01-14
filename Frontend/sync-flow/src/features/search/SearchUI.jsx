import { createPortal } from "react-dom";
import { SearchLogic } from "./SearchLogic";
import { Search, User, ClipboardList, FolderOpen } from "lucide-react";

export default function SearchUI() {
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

  // Debounce setup

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
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 dark:bg-black/20 bg-[#66b3ff0d] backdrop-blur-[5px] saturate-150 animate-in fade-in duration-300"
      />

      {/* Modal */}
      <div
        className="
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
        "
      >
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
          <kbd
            onClick={() => setOpen(false)}
            className="hidden cursor-pointer sm:block px-2.5 py-1 text-xs border rounded bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-500 dark:text-zinc-400"
          >
            esc
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {/* Recent Searches - shown when input is empty */}
          {!debouncedQuery && recentSearches.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
                Recent Searches
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  Clear
                </button>
              </div>

              <ul className="space-y-1 mb-6">
                {recentSearches.map((term) => (
                  <li
                    key={term}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/70 cursor-pointer transition group"
                    onClick={() => {
                      setQuery(term);
                      setDebouncedQuery(term); // trigger search immediately
                    }}
                  >
                    <div className="w-9 h-9 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Search
                        size={16}
                        className="text-gray-500 dark:text-gray-400"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {term}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Recent search
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t border-zinc-200 dark:border-zinc-800 my-4" />
            </>
          )}

          {/* Loading state */}
          {isLoading && debouncedQuery && (
            <div className="py-10 text-center text-zinc-500">Searching...</div>
          )}

          {/* Error state */}
          {isError && debouncedQuery && (
            <div className="py-10 text-center text-red-500">
              {error?.message || "Failed to load results"}
            </div>
          )}

          {/* No results */}
          {!isLoading &&
            !isError &&
            debouncedQuery &&
            searchResults.length === 0 && (
              <div className="py-10 text-center text-zinc-500">
                No results found for "{debouncedQuery}"
              </div>
            )}

          {/* Search results */}
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
