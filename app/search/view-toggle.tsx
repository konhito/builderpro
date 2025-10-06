"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ViewToggle({ view }: { view: "grid" | "list" }) {
  const router = useRouter();
  const params = useSearchParams();

  function setView(v: "grid" | "list") {
    const sp = new URLSearchParams(params.toString());
    sp.set("view", v);
    sp.delete("page");
    router.push(`?${sp.toString()}`);
  }

  const base = "h-8 w-8 grid place-items-center border rounded hover:bg-neutral-50";
  const active = "bg-neutral-900 text-white border-neutral-900";

  return (
    <div className="flex items-center gap-2 text-neutral-600">
      <span className="text-sm">View as</span>
      <button
        onClick={() => setView("grid")}
        className={`${base} ${view === "grid" ? active : ""}`}
        aria-label="Grid view"
      >
        <span className="grid grid-cols-3 gap-0.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 bg-current"></span>
          ))}
        </span>
      </button>
      <button
        onClick={() => setView("list")}
        className={`${base} ${view === "list" ? active : ""}`}
        aria-label="List view"
      >
        <span className="w-4">
          <span className="block h-0.5 w-full bg-current mb-1"></span>
          <span className="block h-0.5 w-full bg-current mb-1"></span>
          <span className="block h-0.5 w-full bg-current"></span>
        </span>
      </button>
    </div>
  );
}
