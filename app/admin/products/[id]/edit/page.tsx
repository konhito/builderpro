import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { product } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  await requireAdmin();

  const { id } = await params;
  const productData = await db
    .select()
    .from(product)
    .where(eq(product.id, id))
    .limit(1);

  if (productData.length === 0) {
    notFound();
  }

  const productInfo = productData[0];

  // Parse JSON fields
  const parsedProduct = {
    ...productInfo,
    images: productInfo.images ? JSON.parse(productInfo.images) : [],
    specifications: productInfo.specifications ? JSON.parse(productInfo.specifications) : {},
    dimensions: productInfo.dimensions ? JSON.parse(productInfo.dimensions) : { length: "", width: "", height: "" },
    tags: productInfo.tags ? JSON.parse(productInfo.tags) : [],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update product information and settings.
        </p>
      </div>

      <ProductForm initialData={parsedProduct} isEdit={true} productId={id} />
    </div>
  );
}
