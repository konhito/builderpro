"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900 mb-4">Oops!</h1>
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">
          Something went wrong
        </h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

