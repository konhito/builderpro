"use client";

import { useEffect } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeStyles = {
    success: {
      bg: "bg-green-50 border-green-200",
      icon: "text-green-600",
      text: "text-green-800",
      iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    error: {
      bg: "bg-red-50 border-red-200",
      icon: "text-red-600",
      text: "text-red-800",
      iconPath: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    warning: {
      bg: "bg-yellow-50 border-yellow-200",
      icon: "text-yellow-600",
      text: "text-yellow-800",
      iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    },
    info: {
      bg: "bg-blue-50 border-blue-200",
      icon: "text-blue-600",
      text: "text-blue-800",
      iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  };

  const style = typeStyles[type];

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] flex items-start gap-3 ${style.bg} border rounded-lg shadow-lg px-4 py-3 min-w-[320px] max-w-[420px] animate-slide-in-right`}
      role="alert"
    >
      {/* Icon */}
      <svg
        className={`w-6 h-6 ${style.icon} flex-shrink-0`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={style.iconPath} />
      </svg>

      {/* Message */}
      <div className={`flex-1 ${style.text} text-sm font-medium`}>
        {message}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className={`${style.icon} hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label="Close"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

