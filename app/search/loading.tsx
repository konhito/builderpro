export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 py-6">
      {/* Title Skeleton */}
      <div className="flex flex-col items-center mb-6">
        <div className="h-9 w-48 bg-gradient-to-r from-red-200 via-red-100 to-red-200 rounded animate-pulse mb-2" />
        <div className="h-0.5 w-[85%] max-w-5xl bg-gradient-to-r from-red-200 via-red-300 to-red-200 rounded animate-pulse" />
      </div>

      {/* Controls Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse" />
          <div className="h-9 w-20 bg-neutral-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-9 bg-neutral-200 rounded animate-pulse" />
          <div className="h-9 w-9 bg-neutral-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-12 gap-6">
        {/* Filters Skeleton */}
        <aside className="hidden md:block md:col-span-3 lg:col-span-3">
          <div className="space-y-6">
            {/* Search Input */}
            <div className="h-9 w-full bg-neutral-200 rounded animate-pulse" />

            {/* Offer Type */}
            <div>
              <div className="h-6 w-24 bg-neutral-200 rounded animate-pulse mb-3" />
              <div className="space-y-2">
                {[...Array(1)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-neutral-200 rounded animate-pulse" />
                    <div className="h-4 flex-1 bg-neutral-200 rounded animate-pulse" />
                    <div className="h-4 w-8 bg-neutral-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <div className="h-6 w-32 bg-neutral-200 rounded animate-pulse mb-3" />
              <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-neutral-200 rounded animate-pulse" />
                    <div className="h-4 flex-1 bg-neutral-200 rounded animate-pulse" />
                    <div className="h-4 w-8 bg-neutral-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid Skeleton */}
        <section className="col-span-12 md:col-span-9 lg:col-span-9">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="border rounded shadow-sm p-6 space-y-3">
                {/* Image */}
                <div className="relative h-48 w-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse overflow-hidden">
                  <div 
                    className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                </div>
                
                {/* SKU */}
                <div className="flex justify-center">
                  <div className="h-5 w-24 bg-neutral-200 rounded animate-pulse" />
                </div>
                
                {/* Title */}
                <div className="space-y-2">
                  <div className="h-4 w-full bg-neutral-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 mx-auto bg-neutral-200 rounded animate-pulse" />
                </div>
                
                {/* Size */}
                <div className="h-5 w-20 mx-auto bg-neutral-200 rounded animate-pulse" />
                
                {/* Unit */}
                <div className="h-3 w-16 mx-auto bg-neutral-200 rounded animate-pulse" />
                
                {/* Buttons */}
                <div className="space-y-2 pt-2">
                  <div className="h-9 w-full bg-gradient-to-r from-red-200 via-red-100 to-red-200 rounded animate-pulse" />
                  <div className="h-4 w-32 mx-auto bg-neutral-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="mt-8 flex justify-center items-center gap-2">
            <div className="h-10 w-24 bg-neutral-200 rounded animate-pulse" />
            <div className="h-10 w-10 bg-neutral-200 rounded animate-pulse" />
            <div className="h-10 w-10 bg-red-200 rounded animate-pulse" />
            <div className="h-10 w-10 bg-neutral-200 rounded animate-pulse" />
            <div className="h-10 w-10 bg-neutral-200 rounded animate-pulse" />
            <div className="h-10 w-24 bg-neutral-200 rounded animate-pulse" />
          </div>
        </section>
      </div>

      {/* Loading Status Toast */}
      <div className="fixed bottom-8 right-8 bg-white border shadow-lg rounded-lg px-4 py-3 flex items-center gap-3 z-50">
        <div className="h-5 w-5 border-3 border-[#DA291C] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-neutral-700">Loading products...</span>
      </div>
    </div>
  );
}
