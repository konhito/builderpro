import { ReactNode } from "react";

type SkeletonProps = {
  className?: string;
  shimmer?: boolean;
  variant?: "default" | "red" | "blue";
  children?: ReactNode;
};

export function Skeleton({ 
  className = "", 
  shimmer = false,
  variant = "default" 
}: SkeletonProps) {
  const baseClass = "rounded animate-pulse";
  
  const variantClasses = {
    default: "bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200",
    red: "bg-gradient-to-r from-red-200 via-red-100 to-red-200",
    blue: "bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200",
  };

  return (
    <div className={`${baseClass} ${variantClasses[variant]} ${className} ${shimmer ? 'relative overflow-hidden' : ''}`}>
      {shimmer && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      )}
    </div>
  );
}

export function SkeletonText({ 
  lines = 3, 
  className = "" 
}: { 
  lines?: number; 
  className?: string 
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

export function SkeletonImage({ 
  aspect = "square",
  shimmer = true,
  className = "" 
}: { 
  aspect?: "square" | "video" | "wide";
  shimmer?: boolean;
  className?: string;
}) {
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
  };

  return (
    <Skeleton 
      shimmer={shimmer}
      className={`${aspectClasses[aspect]} w-full ${className}`}
    />
  );
}

export function SkeletonCard({ 
  withImage = true,
  className = "" 
}: { 
  withImage?: boolean;
  className?: string;
}) {
  return (
    <div className={`border rounded-lg p-4 space-y-3 ${className}`}>
      {withImage && <SkeletonImage shimmer />}
      <Skeleton className="h-4 w-24" />
      <SkeletonText lines={2} />
      <Skeleton className="h-10 w-full" variant="red" />
    </div>
  );
}

export function SkeletonButton({ 
  className = "",
  variant = "default" 
}: { 
  className?: string;
  variant?: "default" | "red";
}) {
  return (
    <Skeleton 
      variant={variant === "red" ? "red" : "default"}
      className={`h-10 w-32 ${className}`}
    />
  );
}

export function SkeletonTable({ 
  rows = 5,
  className = "" 
}: { 
  rows?: number;
  className?: string;
}) {
  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className={`h-16 px-6 flex items-center gap-8 ${
            i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'
          }`}
        >
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function LoadingSpinner({ 
  size = "md",
  className = "" 
}: { 
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-5 w-5 border-3",
    lg: "h-8 w-8 border-4",
  };

  return (
    <div 
      className={`${sizeClasses[size]} border-[#DA291C] border-t-transparent rounded-full animate-spin ${className}`}
    />
  );
}

export function LoadingToast({ 
  message = "Loading...",
  show = true 
}: { 
  message?: string;
  show?: boolean;
}) {
  if (!show) return null;

  return (
    <div className="fixed bottom-8 right-8 bg-white border shadow-lg rounded-lg px-4 py-3 flex items-center gap-3 z-50 animate-in slide-in-from-bottom-4">
      <LoadingSpinner />
      <span className="text-sm font-medium text-neutral-700">{message}</span>
    </div>
  );
}


