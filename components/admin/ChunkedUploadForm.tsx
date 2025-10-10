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

interface ChunkResult {
  success: boolean;
  message: string;
  chunkIndex: number;
  totalChunks: number;
  productsProcessed: number;
  import: {
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
  };
}

export default function ChunkedUploadForm() {
  const router = useRouter();
  const { success, error } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [chunkResults, setChunkResults] = useState<ChunkResult[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSuccess, setTotalSuccess] = useState(0);
  const [totalFailed, setTotalFailed] = useState(0);

  const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB per chunk

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file size (max 20MB total)
      const maxSize = 20 * 1024 * 1024; // 20MB
      if (selectedFile.size > maxSize) {
        error(`File too large. Maximum size is 20MB. Your file is ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB. Please split your file into smaller chunks.`);
        return;
      }
      
      setFile(selectedFile);
      setChunkResults([]);
      setTotalProducts(0);
      setTotalSuccess(0);
      setTotalFailed(0);
    }
  };

  const splitFileIntoChunks = (file: File): Blob[] => {
    const chunks: Blob[] = [];
    let start = 0;
    
    while (start < file.size) {
      const end = Math.min(start + CHUNK_SIZE, file.size);
      chunks.push(file.slice(start, end));
      start = end;
    }
    
    return chunks;
  };

  const uploadChunk = async (chunk: Blob, chunkIndex: number, totalChunks: number): Promise<ChunkResult> => {
    const formData = new FormData();
    formData.append('file', chunk, `chunk_${chunkIndex}.xlsx`);
    formData.append('chunkIndex', chunkIndex.toString());
    formData.append('totalChunks', totalChunks.toString());

    const response = await fetch('/api/admin/products/import-chunked', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload chunk');
    }

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setChunkResults([]);
    setTotalProducts(0);
    setTotalSuccess(0);
    setTotalFailed(0);

    try {
      // Split file into chunks
      const chunks = splitFileIntoChunks(file);
      const totalChunks = chunks.length;
      
      console.log(`Splitting file into ${totalChunks} chunks of max ${CHUNK_SIZE / 1024 / 1024}MB each`);

      const results: ChunkResult[] = [];
      let totalProductsProcessed = 0;
      let totalSuccessCount = 0;
      let totalFailedCount = 0;

      // Upload chunks sequentially to avoid overwhelming the server
      for (let i = 0; i < chunks.length; i++) {
        try {
          console.log(`Uploading chunk ${i + 1}/${totalChunks}`);
          const result = await uploadChunk(chunks[i], i, totalChunks);
          results.push(result);
          
          totalProductsProcessed += result.productsProcessed;
          totalSuccessCount += result.import.success;
          totalFailedCount += result.import.failed;
          
          setChunkResults([...results]);
          setTotalProducts(totalProductsProcessed);
          setTotalSuccess(totalSuccessCount);
          setTotalFailed(totalFailedCount);
          
          setUploadProgress(((i + 1) / totalChunks) * 100);
          
          // Small delay between chunks
          if (i < chunks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (error) {
          console.error(`Error uploading chunk ${i + 1}:`, error);
          error(`Failed to upload chunk ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      success(`Successfully processed ${totalChunks} chunks. ${totalSuccessCount} products imported successfully, ${totalFailedCount} failed.`);
      
    } catch (error) {
      console.error("Error during chunked upload:", error);
      error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      'SKU,Title,Description,Price,Original Price,Category,Image,Images,Stock Quantity,Is Active,Is Featured',
      'PROD001,Sample Product 1,This is a sample product,29.99,39.99,Electronics,https://example.com/image1.jpg,"https://example.com/img1.jpg,https://example.com/img2.jpg",100,true,false',
      'PROD002,Sample Product 2,Another sample product,49.99,,Clothing,https://example.com/image2.jpg,,50,true,true'
    ].join('\n');

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* File Size Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Chunked Upload System
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Large files will be automatically split into 2MB chunks for processing.
                Maximum total file size is <strong>20MB</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Large File (Chunked)</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Excel/CSV File
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileChange}
                        className="sr-only"
                        disabled={isUploading}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">Excel (.xlsx, .xls) or CSV files up to 20MB</p>
                </div>
              </div>
              
              {file && (
                <div className="mt-2 text-sm text-gray-600">
                  <p>Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                  <p>Will be split into {Math.ceil(file.size / CHUNK_SIZE)} chunks of 2MB each</p>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Uploading chunks...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={downloadTemplate}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isUploading}
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
      {chunkResults.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">Total Success</p>
                    <p className="text-2xl font-bold text-green-900">{totalSuccess}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <XCircleIcon className="h-8 w-8 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">Total Failed</p>
                    <p className="text-2xl font-bold text-red-900">{totalFailed}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CloudArrowUpIcon className="h-8 w-8 text-blue-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-800">Chunks Processed</p>
                    <p className="text-2xl font-bold text-blue-900">{chunkResults.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chunk Details */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Chunk Details:</h4>
              {chunkResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">
                    Chunk {result.chunkIndex + 1}: {result.productsProcessed} products
                  </span>
                  <span className={`text-sm font-medium ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                    {result.success ? 'Success' : 'Failed'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
