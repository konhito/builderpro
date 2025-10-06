"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  total: number;
  perPage: number; 
  page: number; 
};

export default function Pagination({ total, perPage, page }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), totalPages);

  const pages = useMemo(() => {
    const window = 2;
    const result: (number | "ellipsis")[] = [];

    const push = (n: number | "ellipsis") => result.push(n);

    const addRange = (start: number, end: number) => {
      for (let i = start; i <= end; i++) push(i);
    };

    const start = Math.max(1, current - window);
    const end = Math.min(totalPages, current + window);

    if (start > 1) {
      push(1);
      if (start > 2) push("ellipsis");
    }

    addRange(start, end);

    if (end < totalPages) {
      if (end < totalPages - 1) push("ellipsis");
      push(totalPages);
    }

    return result;
  }, [current, totalPages]);

  function go(to: number) {
    const sp = new URLSearchParams(params.toString());
    sp.set("page", String(to));
    router.push(`?${sp.toString()}`);
  }

  const canPrev = current > 1;
  const canNext = current < totalPages;

  return (
    <nav className="mt-8 flex items-center justify-center gap-2 select-none" aria-label="Pagination">
      <button
        onClick={() => canPrev && go(current - 1)}
        disabled={!canPrev}
        className="h-9 rounded border px-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e-${i}`} className="px-2 text-neutral-500">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => go(p)}
            className={`h-9 min-w-9 rounded border px-3 text-sm ${
              p === current ? "bg-neutral-900 text-white border-neutral-900" : "hover:bg-neutral-50"
            }`}
            aria-current={p === current ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => canNext && go(current + 1)}
        disabled={!canNext}
        className="h-9 rounded border px-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </nav>
  );
}
