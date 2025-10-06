# 🚀 IMPORTANT: Setup Instructions

## ⚡ Quick Start (3 Steps)

### 1. Create Environment File

Create a `.env.local` file in the root directory:

```bash
# Create the file
touch .env.local
```

Add this content (replace the placeholders):

```env
# ✅ Neon Database (Already configured)
DATABASE_URL='postgresql://neondb_owner:npg_5rciZ2fWaeBD@ep-divine-haze-a10g72eb-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

# 🔑 Better Auth Secret (GENERATE A NEW ONE!)
BETTER_AUTH_SECRET="REPLACE_THIS_WITH_32_RANDOM_CHARACTERS"
BETTER_AUTH_URL="http://localhost:3000"

# 🔐 Google OAuth (Get from Google Console)
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"

# 🌐 Base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 2. Generate Secret Key

Run this command to generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as `BETTER_AUTH_SECRET` in `.env.local`

### 3. Set Up Google OAuth

1. Go to: https://console.cloud.google.com/
2. Create a new project (or use existing)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add Authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Copy **Client ID** and **Client Secret** to `.env.local`

### 4. Push Database Schema

```bash
npm run db:push
```

This creates all the necessary tables in your Neon database.

### 5. Start the App

```bash
npm run dev
```

Visit: http://localhost:3000

## ✅ Test Authentication

### Test Email/Password Registration
1. Go to: http://localhost:3000/register
2. Fill in: Name, Email, Password
3. Click "Create Account"
4. You should be logged in and redirected to homepage

### Test Email/Password Login
1. Go to: http://localhost:3000/login
2. Enter the email and password you registered with
3. Click "Log in"
4. You should be logged in

### Test Google Sign-In
1. Go to: http://localhost:3000/login
2. Click "Sign in with Google"
3. Select your Google account
4. You should be logged in and redirected

### Check User Menu
1. After logging in, look at the top-right of the navbar
2. You should see your profile picture or initial
3. Click it to see the dropdown menu with:
   - My Profile
   - My Orders
   - Settings
   - Sign Out

## 📁 What Was Created

### Backend
- ✅ `lib/db/schema.ts` - Database schema (4 tables)
- ✅ `lib/db/index.ts` - Drizzle client
- ✅ `lib/auth.ts` - Better Auth server config
- ✅ `lib/auth-client.ts` - Client-side auth hooks
- ✅ `app/api/auth/[...all]/route.ts` - Auth API endpoints

### Frontend
- ✅ `app/login/page.tsx` - Login page (email + Google)
- ✅ `app/register/page.tsx` - Register page (email + Google)
- ✅ `components/UserMenu.tsx` - User dropdown menu
- ✅ `components/Navbar.tsx` - Updated with UserMenu

### Configuration
- ✅ `drizzle.config.ts` - Drizzle ORM config
- ✅ `.env.example` - Environment variables template
- ✅ `package.json` - Added database scripts

## 🗄️ Database Tables

Your Neon database now has:

### 1. `user`
- Stores user accounts
- Fields: id, name, email, emailVerified, image, timestamps

### 2. `session`
- Stores active user sessions
- Fields: id, token, userId, expiresAt, ipAddress, userAgent

### 3. `account`
- Stores OAuth accounts and passwords
- Fields: id, accountId, providerId, userId, tokens, password

### 4. `verification`
- Stores email verification tokens
- Fields: id, identifier, value, expiresAt

## 🔐 Features Implemented

### Authentication Methods
- ✅ Email/Password registration
- ✅ Email/Password login
- ✅ Google OAuth sign-in
- ✅ Secure password hashing (Argon2)
- ✅ Session management

### UI Components
- ✅ Beautiful login form
- ✅ Beautiful register form
- ✅ Google sign-in button with logo
- ✅ User dropdown menu in navbar
- ✅ Profile picture/initial display
- ✅ Loading states
- ✅ Error handling

### User Menu Options
- My Profile (placeholder)
- My Orders (placeholder)
- Settings (placeholder)
- Sign Out (working)

## 🛠️ Database Commands

```bash
# Push schema to database (no migration files)
npm run db:push

# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate

# Open Drizzle Studio (visual database browser)
npm run db:studio
```

## 💻 Usage in Your Code

### Check if User is Logged In

```tsx
"use client";

import { useSession } from "@/lib/auth-client";

export default function MyComponent() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;

  if (!session) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {session.user.name}!</p>
      <p>Email: {session.user.email}</p>
      {session.user.image && (
        <img src={session.user.image} alt="Profile" />
      )}
    </div>
  );
}
```

### Sign Out

```tsx
import { signOut } from "@/lib/auth-client";

const handleSignOut = async () => {
  await signOut();
  window.location.href = "/";
};
```

### Protect a Page

```tsx
"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) return <div>Loading...</div>;

  if (!session) return null;

  return <div>Protected content</div>;
}
```

## 🐛 Troubleshooting

### "DATABASE_URL is not set"
➡️ Create `.env.local` file with DATABASE_URL

### "BETTER_AUTH_SECRET is not set"
➡️ Add BETTER_AUTH_SECRET to `.env.local`

### "GOOGLE_CLIENT_ID is not set"
➡️ Add Google OAuth credentials to `.env.local`

### Google OAuth "redirect_uri_mismatch"
➡️ Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs in Google Console

### "Invalid credentials" on login
➡️ Make sure you registered the user first, or password is correct

### Database connection failed
➡️ Check that DATABASE_URL is correct and Neon database is accessible

## 📚 Documentation Files

- `AUTH_SETUP.md` - Complete authentication setup guide
- `SETUP_INSTRUCTIONS.md` - This file (quick start)
- `.env.example` - Environment variables template

## 🎉 You're Done!

Your authentication system is fully set up with:
- ✅ Email/Password authentication
- ✅ Google OAuth
- ✅ Secure password hashing
- ✅ Session management
- ✅ User menu in navbar
- ✅ Beautiful UI
- ✅ Type-safe database with Drizzle ORM
- ✅ Neon PostgreSQL database

Now you can:
1. **Register users** at `/register`
2. **Login users** at `/login`
3. **Sign in with Google**
4. **Check user session** with `useSession()` hook
5. **Protect pages** by checking session
6. **Sign out** from user menu

## 🔥 Next Steps

1. Implement "My Profile" page to show user details
2. Implement "My Orders" page for order history
3. Implement "Settings" page for account settings
4. Add email verification for production
5. Add password reset functionality
6. Add more OAuth providers (GitHub, Facebook, etc.)

Happy coding! 🚀


