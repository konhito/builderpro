"use client";

import { useState, useCallback } from "react";
import { Toast, ToastType } from "@/components/Toast";

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const ToastContainer = useCallback(() => {
    return (
      <>
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              top: `${1 + index * 5.5}rem`,
            }}
          >
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </>
    );
  }, [toasts, removeToast]);

  return {
    showToast,
    success: useCallback((message: string) => showToast(message, "success"), [showToast]),
    error: useCallback((message: string) => showToast(message, "error"), [showToast]),
    warning: useCallback((message: string) => showToast(message, "warning"), [showToast]),
    info: useCallback((message: string) => showToast(message, "info"), [showToast]),
    ToastContainer,
  };
}

