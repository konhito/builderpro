import ExcelImportForm from "@/components/admin/ExcelImportForm";

export default async function ImportProductsPage() {
  // Admin authentication is handled by the layout

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Import Products</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload an Excel file to import or update products in bulk.
        </p>
      </div>

      <ExcelImportForm />
    </div>
  );
}
