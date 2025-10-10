"use client";

import { useState } from "react";

interface FileSizeWarningProps {
  onFileSelect: (file: File) => void;
}

export default function FileSizeWarning({ onFileSelect }: FileSizeWarningProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            File Size Limit
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Due to server limitations, the maximum file size is <strong>10MB</strong>.
              If your file is larger, please split it into smaller chunks.
            </p>
            <div className="mt-3">
              <p className="font-medium">Tips for large files:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Split your Excel file into multiple smaller files</li>
                <li>Remove unnecessary columns to reduce file size</li>
                <li>Use CSV format instead of Excel for smaller file sizes</li>
                <li>Compress images before including them in the file</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
