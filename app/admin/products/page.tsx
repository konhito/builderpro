import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { product } from "@/lib/db/schema";
import { desc, eq, like, or } from "drizzle-orm";
import ProductsTable from "@/components/admin/ProductsTable";
import ProductsFilters from "@/components/admin/ProductsFilters";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

interface SearchParams {
  search?: string;
  category?: string;
  status?: string;
  page?: string;
}

interface ProductsPageProps {
  searchParams: SearchParams;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  await requireAdmin();

  const page = parseInt(searchParams.page || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  // Build where conditions
  const whereConditions = [];
  
  if (searchParams.search) {
    whereConditions.push(
      or(
        like(product.title, `%${searchParams.search}%`),
        like(product.sku, `%${searchParams.search}%`),
        like(product.description, `%${searchParams.search}%`)
      )!
    );
  }
  
  if (searchParams.category) {
    whereConditions.push(eq(product.category, searchParams.category));
  }
  
  if (searchParams.status === "active") {
    whereConditions.push(eq(product.isActive, true));
  } else if (searchParams.status === "inactive") {
    whereConditions.push(eq(product.isActive, false));
  }

  // Get products
  const products = await db
    .select()
    .from(product)
    .where(whereConditions.length > 0 ? or(...whereConditions) : undefined)
    .orderBy(desc(product.createdAt))
    .limit(limit)
    .offset(offset);

  // Get total count for pagination
  const totalCount = await db
    .select({ count: product.id })
    .from(product)
    .where(whereConditions.length > 0 ? or(...whereConditions) : undefined);

  const totalPages = Math.ceil(totalCount.length / limit);

  // Get unique categories for filter
  const categories = await db
    .selectDistinct({ category: product.category })
    .from(product)
    .where(eq(product.category, product.category));

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product catalog and inventory.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link
            href="/admin/products/import"
            className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            <svg className="-ml-0.5 mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Import Excel
          </Link>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Product
          </Link>
        </div>
      </div>

      <ProductsFilters 
        categories={categories.map(c => c.category).filter((cat): cat is string => Boolean(cat))}
        currentFilters={searchParams}
      />

      <ProductsTable 
        products={products}
        currentPage={page}
        totalPages={totalPages}
        currentFilters={searchParams}
      />
    </div>
  );
}
