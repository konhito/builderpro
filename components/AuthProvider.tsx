"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();

  useEffect(() => {
    // This ensures the session is properly loaded
    if (!isPending) {
      console.log("Session state:", session ? "Logged in" : "Not logged in");
    }
  }, [session, isPending]);

  return <>{children}</>;
}
