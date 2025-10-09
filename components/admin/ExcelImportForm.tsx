"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { 
  CloudArrowUpIcon, 
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    sku: string;
    error: string;
  }>;
  warnings: Array<{
    row: number;
    sku: string;
    warning: string;
  }>;
}

interface ValidationResult {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    sku: string;
    error: string;
  }>;
  warnings: Array<{
    row: number;
    sku: string;
    warning: string;
  }>;
}

export default function ExcelImportForm() {
  const router = useRouter();
  const { success, error } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [, setValidationResult] = useState<ValidationResult | null>(null);
  const [templateInfo, setTemplateInfo] = useState<{
    requiredColumns: string[];
    optionalColumns: string[];
    examples: Record<string, string>;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImportResult(null);
      setValidationResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      error("Please select a file to upload");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/products/import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setImportResult(result.import);
        setValidationResult(result.validation);
        
        success(`Successfully imported ${result.import.success} products`);

        // Redirect to products page after successful import
        setTimeout(() => {
          router.push('/admin/products');
        }, 2000);
      } else {
        setValidationResult(result.validation);
        
        error(result.message || "Failed to import products");
      }
    } catch {
      error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await fetch('/api/admin/products/import');
      const template = await response.json();
      setTemplateInfo(template);
      
      // Create a simple CSV template
      const csvContent = createCSVTemplate(template);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'product-import-template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      error("Failed to download template");
    }
  };

  const createCSVTemplate = (template: {
    requiredColumns: string[];
    optionalColumns: string[];
    examples: Record<string, string>;
  }) => {
    const headers = [...template.requiredColumns, ...template.optionalColumns];
    const exampleRow = headers.map(header => template.examples[header] || '');
    
    return [
      headers.join(','),
      exampleRow.join(','),
      '', // Empty row
      '# Instructions:',
      '# 1. Fill in the required columns (SKU, Title)',
      '# 2. Add optional information as needed',
      '# 3. Save as Excel (.xlsx) or CSV format',
      '# 4. Upload the file using the form above',
    ].join('\n');
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Excel File</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                Select Excel File
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file"
                        name="file"
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Excel files (.xlsx, .xls) or CSV files up to 10MB
                  </p>
                </div>
              </div>
              
              {file && (
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={downloadTemplate}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Download Template
              </button>

              <button
                type="submit"
                disabled={!file || isUploading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? "Uploading..." : "Upload & Import"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      {importResult && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Import Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">Successful</p>
                    <p className="text-2xl font-bold text-green-900">{importResult.success}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <XCircleIcon className="h-8 w-8 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">Failed</p>
                    <p className="text-2xl font-bold text-red-900">{importResult.failed}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-8 w-8 text-blue-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-800">Warnings</p>
                    <p className="text-2xl font-bold text-blue-900">{importResult.warnings.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Errors */}
            {importResult.errors.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-red-800 mb-2">Errors</h4>
                <div className="bg-red-50 border border-red-200 rounded-md p-4 max-h-60 overflow-y-auto">
                  {importResult.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-700 mb-1">
                      Row {error.row}: {error.sku} - {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {importResult.warnings.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">Warnings</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 max-h-60 overflow-y-auto">
                  {importResult.warnings.map((warning, index) => (
                    <div key={index} className="text-sm text-yellow-700 mb-1">
                      Row {warning.row}: {warning.sku} - {warning.warning}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Template Information */}
      {templateInfo && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Template Information</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Required Columns</h4>
                <div className="flex flex-wrap gap-2">
                  {templateInfo.requiredColumns.map((col: string) => (
                    <span key={col} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {col}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Optional Columns</h4>
                <div className="flex flex-wrap gap-2">
                  {templateInfo.optionalColumns.map((col: string) => (
                    <span key={col} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {col}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {templateInfo.notes.map((note: string, index: number) => (
                    <li key={index}>• {note}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
