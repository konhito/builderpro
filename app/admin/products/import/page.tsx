import ExcelImportForm from "@/components/admin/ExcelImportForm";
import ChunkedUploadForm from "@/components/admin/ChunkedUploadForm";
import ExcelFieldMapping from "@/components/admin/ExcelFieldMapping";

export default async function ImportProductsPage() {
  // Admin authentication is handled by the layout

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Import Products</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload an Excel file to import or update products in bulk. Choose the appropriate method based on your file size.
        </p>
      </div>

      {/* Field Mapping Guide */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Supported Fields</h2>
        <ExcelFieldMapping />
      </div>

      {/* Standard Upload (for files up to 5MB) */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Standard Upload (up to 5MB)</h2>
        <ExcelImportForm />
      </div>

      {/* Chunked Upload (for larger files) */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Chunked Upload (up to 2MB)</h2>
        <ChunkedUploadForm />
      </div>
    </div>
  );
}
