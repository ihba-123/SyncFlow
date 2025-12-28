// FullPageSkeleton.jsx
export default function FullPageSkeleton({ isSidebarExpanded = true }) {
  return (
    <div className="min-h-screen flex animate-pulse bg-gray-50 dark:bg-gray-950">
      {/* Sidebar - Icon-only skeleton */}
      <aside className="flex flex-col bg-gray-100 dark:bg-gray-900/30 p-3 w-16 overflow-hidden">
        {/* Logo icon only */}
        <div className="h-14 mb-6 flex items-center justify-center">
          <div className="w-10 h-10 rounded-lg bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* Nav items - icons only */}
        <nav className="flex-1 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-10 mx-auto rounded-lg bg-gray-300 dark:bg-gray-700"
            />
          ))}
        </nav>

        {/* Divider */}
        <div className="pt-4">
          <div className="py-4">
            <div className="h-px bg-gray-300 dark:bg-gray-600 w-full" />
          </div>

          {/* Profile avatar only */}
          <div className="flex items-center justify-center py-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />
          </div>
        </div>
      </aside>

      {/* Main content area (unchanged - keeps your original layout) */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <header className="flex items-center justify-between h-16 bg-white dark:bg-gray-900/30 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-300 dark:bg-gray-700" />
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-gray-300 dark:bg-gray-700" />
            <div className="w-8 h-8 rounded-lg bg-gray-300 dark:bg-gray-700" />
          </div>
        </header>

        {/* Content placeholder */}
        <main className="flex-1 p-6 sm:p-8 lg:p-12 space-y-6">
          {/* Page title */}
          <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded" />

          {/* Subtitle / breadcrumb */}
          <div className="h-4 w-64 bg-gray-300 dark:bg-gray-700 rounded" />

          {/* Card placeholders */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gray-200 dark:bg-gray-800/40 rounded-2xl shadow-inner"
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}