import { auth } from "./auth";
import { db } from "./db";
import { user } from "./db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type AdminRole = "admin" | "super_admin";

export async function getAdminSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  // Get user with role information
  const userWithRole = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!userWithRole[0]) {
    return null;
  }

  const userRole = userWithRole[0].role as AdminRole;
  
  if (userRole !== "admin" && userRole !== "super_admin") {
    return null;
  }

  return {
    ...session,
    user: {
      ...session.user,
      role: userRole,
    },
  };
}

export async function requireAdmin() {
  const session = await getAdminSession();
  
  if (!session) {
    redirect("/login?redirect=/admin");
  }
  
  return session;
}

export async function requireSuperAdmin() {
  const session = await getAdminSession();
  
  if (!session || session.user.role !== "super_admin") {
    redirect("/login?redirect=/admin");
  }
  
  return session;
}

export function isAdmin(userRole: string): boolean {
  return userRole === "admin" || userRole === "super_admin";
}

export function isSuperAdmin(userRole: string): boolean {
  return userRole === "super_admin";
}
