export default function UserProfileSkeleton() {
  return (
    <div className="min-h-screen py-6 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gray-100 dark:bg-gray-800 backdrop-blur-md rounded-3xl border border-gray-300 dark:border-gray-700 shadow-lg overflow-hidden animate-pulse">
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 lg:gap-8">
              
              {/* Avatar Skeleton */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0" />

              {/* User Info Skeleton */}
              <div className="flex-1 text-center sm:text-left w-full">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="max-w-2xl space-y-4">
                    {/* Name */}
                    <div className="h-6 sm:h-8 w-48 bg-gray-300 dark:bg-gray-600 rounded" />
                    
                    {/* Bio */}
                    <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded" />
                    <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-600 rounded" />

                    {/* Email */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                      <div className="h-4 w-40 bg-gray-300 dark:bg-gray-600 rounded" />
                    </div>
                  </div>

                  {/* Edit Button Skeleton */}
                  <div className="w-32 h-12 bg-gray-300 dark:bg-gray-700 rounded-sm flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
