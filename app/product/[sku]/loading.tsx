export default function Loading() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 py-8">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <div className="h-4 w-12 bg-neutral-200 rounded animate-pulse" />
        <div className="h-4 w-1 bg-neutral-200 rounded animate-pulse" />
        <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
        <div className="h-4 w-1 bg-neutral-200 rounded animate-pulse" />
        <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square w-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded-lg animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square w-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse relative overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" style={{ animationDelay: `${i * 0.1}s` }} />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="h-7 w-32 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse" />
            <div className="h-9 w-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse" />
            <div className="h-9 w-3/4 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse" />
            <div className="h-6 w-48 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse" />
          </div>

          <div className="h-11 w-36 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse" />

          <div className="h-20 w-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse" />

          <div className="border-y border-neutral-200 py-4">
            <div className="h-5 w-56 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse" />
          </div>

          <div className="space-y-3">
            <div className="h-6 w-32 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="h-12 w-full sm:w-56 bg-gradient-to-r from-[#DA291C] via-red-400 to-[#DA291C] rounded-md animate-pulse" />
            <div className="h-12 w-full sm:w-48 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded-md animate-pulse" />
          </div>

          <div className="h-12 w-full bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Specifications Skeleton */}
      <div className="mt-12">
        <div className="h-8 w-48 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse mb-6" />
        <div className="bg-neutral-50 rounded-lg border overflow-hidden">
          <div className="space-y-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`h-16 w-full ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}
              >
                <div className="flex items-center h-full px-6 gap-8">
                  <div className="h-4 w-1/3 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="mt-12">
        <div className="h-8 w-56 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <div className="aspect-square bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse" />
              <div className="h-3 w-20 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Loading Status */}
      <div className="fixed bottom-8 right-8 bg-white border shadow-lg rounded-lg px-4 py-3 flex items-center gap-3">
        <div className="h-5 w-5 border-3 border-[#DA291C] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-neutral-700">Loading product details...</span>
      </div>
    </div>
  );
}

