import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  // Admin authentication is handled by the layout

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new product for your catalog.
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
