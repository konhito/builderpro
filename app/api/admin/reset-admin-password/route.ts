import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user, account } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { hash } from "@node-rs/argon2";

type ResetRequestBody = {
  token?: string;
  email?: string;
  password?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ResetRequestBody;
    const providedToken = body.token || request.headers.get("x-reset-token") || undefined;
    const expectedToken = process.env.ADMIN_RESET_TOKEN;

    if (!expectedToken) {
      return NextResponse.json({ error: "ADMIN_RESET_TOKEN not configured" }, { status: 500 });
    }

    if (!providedToken || providedToken !== expectedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const targetEmail = body.email || "admin@timco.com";
    const newPassword = body.password;

    if (!newPassword) {
      return NextResponse.json({ error: "password is required" }, { status: 400 });
    }

    const users = await db.select().from(user).where(eq(user.email, targetEmail)).limit(1);
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const targetUser = users[0];

    const hashed = await hash(newPassword);

    // Update existing credential account; if not present, create it
    const credentialAccounts = await db
      .select()
      .from(account)
      .where(and(eq(account.userId, targetUser.id), eq(account.providerId, "credential")))
      .limit(1);

    if (credentialAccounts.length === 0) {
      await db.insert(account).values({
        accountId: targetUser.id,
        providerId: "credential",
        userId: targetUser.id,
        password: hashed,
      });
    } else {
      await db
        .update(account)
        .set({ password: hashed })
        .where(and(eq(account.userId, targetUser.id), eq(account.providerId, "credential")));
    }

    return NextResponse.json({ success: true, email: targetEmail });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}


