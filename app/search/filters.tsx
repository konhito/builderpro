"use client";

import { useRouter, useSearchParams } from "next/navigation";

export type FilterState = {
  category?: string[]; 
  offer?: string[];
  q?: string;
};

const KNOWN_CATEGORIES = [
  "Screws",
  "Fasteners & Fixings",
  "Nails",
  "Adhesives & Building Chemicals",
  "Powertool Accessories",
  "Hand Tools",
  "Painting & Decorating",
  "Building Hardware & Supplies",
  "Security & Ironmongery",
  "Workwear, PPE & Safety",
];

export default function Filters({
  counts,
}: {
  counts: Record<string, number>;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const selectedCategories = new Set(params.getAll("category"));
  const selectedOffers = new Set(params.getAll("offer"));

  function toggleMulti(key: keyof FilterState, value: string) {
    const sp = new URLSearchParams(params.toString());
    let existing = sp.getAll(key as string);

    if (existing.includes(value)) {
      existing = existing.filter((v) => v !== value);
      sp.delete(key as string);
      existing.forEach((v) => sp.append(key as string, v));
    } else {
      sp.append(key as string, value);
    }
    sp.delete("page");
    router.push(`?${sp.toString()}`);
  }

  function setQuery(q: string) {
    const sp = new URLSearchParams(params.toString());
    if (q) sp.set("q", q);
    else sp.delete("q");
    sp.delete("page");
    router.push(`?${sp.toString()}`);
  }

  return (
    <aside className="hidden md:block md:col-span-3 lg:col-span-3">
      <div className="space-y-6">
        <div>
          <input
            type="search"
            placeholder="Search products..."
            defaultValue={params.get("q") || ""}
            onKeyDown={(e) => {
              if (e.key === "Enter") setQuery((e.target as HTMLInputElement).value);
            }}
            className="w-full h-9 rounded border px-3 text-sm"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold">Offer Type</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={selectedOffers.has("Clearance")}
                onChange={() => toggleMulti("offer", "Clearance")}
                id="clearance"
              />
              <label htmlFor="clearance" className="flex-1">
                Clearance
              </label>
              <span className="text-neutral-500">{counts["Clearance"] ?? 0}</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Product Category</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {KNOWN_CATEGORIES.map((name) => (
              <li key={name} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={selectedCategories.has(name)}
                  onChange={() => toggleMulti("category", name)}
                  id={`cat-${name}`}
                />
                <label htmlFor={`cat-${name}`} className="flex-1">
                  {name}
                </label>
                <span className="text-neutral-500">{counts[name] ?? 0}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
