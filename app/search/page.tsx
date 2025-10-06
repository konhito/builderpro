import Image from "next/image";
import productsData from "@/assets/products.json";
import Link from "next/link";
import DisplaySelect from "@/app/search/select-display";
import Pagination from "@/app/search/pagination";
import ViewToggle from "@/app/search/view-toggle";
import Filters, { type FilterState } from "@/app/search/filters";

type Product = {
  id: string;
  sku: string;
  title: string;
  size?: string;
  quantity?: string;
  image?: string;
  url?: string;
  variants?: string;
};

function deriveCategory(p: Product): string {
  const t = p.title.toLowerCase();
  
  // Screws
  if (t.includes("screw")) return "Screws";
  
  // Nails
  if (t.includes("nail") || t.includes("tack") || t.includes("pin")) return "Nails";
  
  // Fasteners & Fixings
  if (t.includes("fix") || t.includes("anchor") || t.includes("bolt") || 
      t.includes("nut") || t.includes("washer") || t.includes("rivet") ||
      t.includes("clip") || t.includes("hook")) 
    return "Fasteners & Fixings";
  
  // Adhesives & Building Chemicals
  if (t.includes("adhesive") || t.includes("glue") || t.includes("sealant") || 
      t.includes("silicone") || t.includes("filler") || t.includes("cement") ||
      t.includes("resin") || t.includes("bond"))
    return "Adhesives & Building Chemicals";
  
  // Powertool Accessories
  if (t.includes("drill") || t.includes("saw") || t.includes("blade") || 
      t.includes("bit") || t.includes("disc") || t.includes("sand") ||
      t.includes("grind") || t.includes("cut"))
    return "Powertool Accessories";
  
  // Hand Tools
  if (t.includes("hammer") || t.includes("chisel") || t.includes("plier") || 
      t.includes("wrench") || t.includes("spanner") || t.includes("screwdriver") ||
      t.includes("tool") || t.includes("knife"))
    return "Hand Tools";
  
  // Painting & Decorating
  if (t.includes("paint") || t.includes("brush") || t.includes("roller") || 
      t.includes("decorat") || t.includes("tape") || t.includes("mask"))
    return "Painting & Decorating";
  
  // Building Hardware & Supplies
  if (t.includes("hinge") || t.includes("handle") || t.includes("bracket") ||
      t.includes("rail") || t.includes("channel") || t.includes("strip"))
    return "Building Hardware & Supplies";
  
  // Security & Ironmongery
  if (t.includes("lock") || t.includes("latch") || t.includes("bolt") || 
      t.includes("security") || t.includes("padlock") || t.includes("chain") ||
      t.includes("ironmong"))
    return "Security & Ironmongery";
  
  // Workwear, PPE & Safety
  if (t.includes("glove") || t.includes("safety") || t.includes("protective") || 
      t.includes("helmet") || t.includes("goggle") || t.includes("mask") ||
      t.includes("vest") || t.includes("boot"))
    return "Workwear, PPE & Safety";
  
  // Default
  return "Fasteners & Fixings"; 
}

function applyFilters(all: Product[], f: FilterState) {
  let out = all;
  if (f.q && f.q.trim()) {
    const q = f.q.trim().toLowerCase();
    out = out.filter(
      (p) => p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    );
  }
  if (f.category && f.category.length) {
    out = out.filter((p) => f.category!.includes(deriveCategory(p)));
  }

  if (f.offer?.includes("Clearance")) {
    out = out.filter((p) => /clearance|promo|sale/i.test(p.title));
  }
  return out;
}

function countFacets(all: Product[]) {
  const counts: Record<string, number> = {};
  for (const p of all) {
    const c = deriveCategory(p);
    counts[c] = (counts[c] ?? 0) + 1;
  }
  counts["Clearance"] = all.filter((p) => /clearance|promo|sale/i.test(p.title)).length;
  return counts;
}

function ProductCard({ p }: { p: Product }) {
  return (
    <div className="border rounded shadow-sm hover:shadow-md transition-shadow duration-200">
      <Link href={`/product/${p.sku}`} className="block p-6">
        <div className="relative h-48 w-full mb-3 grid place-items-center">
          {p.image ? (
            <Image
              src={p.image}
              alt={p.title}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-contain"
            />
          ) : (
            <div className="h-full w-full grid place-items-center bg-neutral-50 text-neutral-400 text-sm">
              No image
            </div>
          )}
        </div>
        <div className="text-center space-y-1">
          <span className="inline-block border rounded px-2 py-0.5 text-xs text-neutral-700">
            {p.sku}
          </span>
          <h4 className="min-h-[2.5rem] text-sm font-medium leading-snug">
            {p.title}
          </h4>
          {(p.size || p.quantity) && (
            <p className="text-sm font-semibold mt-2">
              {p.size ?? ""}
            </p>
          )}
          <p className="text-xs text-neutral-500">Unit : {p.quantity?.split(":")[1]?.trim() ?? "1"}</p>

          <div className="mt-4 flex flex-col items-center gap-2">
            <span className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm px-4 py-2 hover:from-blue-700 hover:to-blue-800 shadow-md transition-all">
              View Details
            </span>
            {p.variants && (
              <span className="text-xs text-neutral-600">
                {p.variants}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const perPage = Math.max(
    1,
    Math.min(200, Number(sp?.display ?? 20) || 20)
  );
  const page = Math.max(1, Number(sp?.page ?? 1) || 1);
  const view = (typeof sp?.view === "string" ? sp?.view : "grid") as "grid" | "list";
  const allProducts = productsData as Product[];
  const facetCounts = countFacets(allProducts);
  const filters: FilterState = {
    category: Array.isArray(sp?.category)
      ? (sp?.category as string[])
      : sp?.category
      ? [sp.category as string]
      : undefined,
    offer: Array.isArray(sp?.offer)
      ? (sp?.offer as string[])
      : sp?.offer
      ? [sp.offer as string]
      : undefined,
    q: (sp?.q as string) || undefined,
  };
  const filtered = applyFilters(allProducts, filters);
  const total = filtered.length;
  const start = (page - 1) * perPage;
  const products = filtered.slice(start, start + perPage);
  const activeHeading = filters.category && filters.category.length === 1 ? filters.category[0] : "Search";

  return (
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 py-8">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
              {activeHeading}
            </h1>
            <div className="mt-2 h-1 w-20 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full" />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
            <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-sm font-semibold text-slate-700">
              {total.toLocaleString()} Products
            </span>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">Display:</span>
              <DisplaySelect perPage={perPage} />
              <span className="text-sm text-slate-500">per page</span>
            </div>
            <div className="h-6 w-px bg-slate-300 hidden sm:block" />
            <ViewToggle view={view} />
          </div>
          <div className="text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md">
            {start + 1}–{Math.min(start + perPage, total)} of {total}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-12 gap-6">
  <Filters counts={facetCounts} />
        <section className="col-span-12 md:col-span-9 lg:col-span-9">
          <div
            className={
              view === "grid"
                ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid gap-6 grid-cols-1"
            }
          >
            {products.map((p) => (
              <ProductCard p={p} key={p.id + p.sku} />
            ))}
          </div>
          <Pagination total={total} perPage={perPage} page={page} />
        </section>
      </div>
    </div>
  );
}
