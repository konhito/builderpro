"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // If we're on the admin login page, don't check authentication
    if (pathname === "/admin") {
      setLoading(false);
      return;
    }

    // Check if admin is logged in via localStorage
    const isLoggedIn = localStorage.getItem("admin_logged_in");
    const userData = localStorage.getItem("admin_user");

    if (!isLoggedIn || !userData) {
      // If not logged in, redirect to admin login page
      router.push("/admin");
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role === "super_admin" || user.role === "admin") {
        setIsAdmin(true);
      } else {
        router.push("/admin");
        return;
      }
    } catch (error) {
      console.error("Error parsing admin user data:", error);
      router.push("/admin");
      return;
    }

    setLoading(false);
  }, [mounted, pathname, router]);

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null;
  }

  // If we're on the admin login page, render children directly
  if (pathname === "/admin") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
