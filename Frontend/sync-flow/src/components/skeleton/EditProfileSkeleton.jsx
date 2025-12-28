export default function EditProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all animate-pulse">
      <div className="flex">
        {/* Sidebar Skeleton */}
        <aside className="hidden md:block w-80 bg-gray-100 dark:bg-gray-800/40 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 h-screen fixed p-8 space-y-8">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600 mb-5"></div>
            {/* Name */}
            <div className="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
          {/* Menu */}
          <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1 md:ml-80 p-6 sm:p-8 lg:p-12 space-y-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Mobile avatar & name */}
            <div className="md:hidden flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-6 w-48 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>

            {/* Title */}
            <div className="h-8 w-48 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 w-64 bg-gray-300 dark:bg-gray-600 rounded"></div>

            {/* Form Skeleton */}
            <div className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-2xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
              {/* Name input */}
              <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
              {/* Bio textarea */}
              <div className="h-24 w-full bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
              {/* Profile photo section */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="h-10 w-28 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-10 w-36 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
