# 🔐 Authentication Setup Guide

Complete guide to set up authentication with Drizzle ORM, Neon PostgreSQL, and Better Auth.

## 📦 What's Installed

- ✅ **Drizzle ORM** - Type-safe database ORM
- ✅ **Neon PostgreSQL** - Serverless Postgres database
- ✅ **Better Auth** - Modern authentication library
- ✅ **Google OAuth** - Social authentication
- ✅ **Email/Password** - Traditional authentication

## 🗄️ Database Schema

### Tables Created
1. **user** - User accounts
2. **session** - User sessions
3. **account** - OAuth accounts
4. **verification** - Email verification tokens

## 🚀 Setup Steps

### Step 1: Create `.env.local` file

Create a `.env.local` file in the root directory with your credentials:

```bash
# Copy the example file
cp .env.example .env.local
```

Then edit `.env.local`:

```env
# Neon Database (Already provided)
DATABASE_URL='postgresql://neondb_owner:npg_5rciZ2fWaeBD@ep-divine-haze-a10g72eb-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

# Better Auth Secret (CHANGE THIS!)
BETTER_AUTH_SECRET="generate-a-random-32-character-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### Step 2: Generate Secret Key

Generate a secure secret for Better Auth:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use any password generator for a 32+ character string
```

### Step 3: Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set Application Type: **Web Application**
6. Add Authorized Redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Copy **Client ID** and **Client Secret** to `.env.local`

### Step 4: Push Database Schema

Push the schema to your Neon database:

```bash
npm run db:push
```

This will create all necessary tables in your database.

### Step 5: Start Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

## ✨ Features

### Email/Password Authentication
- ✅ User registration with name, email, password
- ✅ Password hashing with Argon2
- ✅ Login with email and password
- ✅ Password validation (min 8 characters)
- ✅ Secure session management

### Google OAuth
- ✅ Sign in with Google button
- ✅ Automatic account creation
- ✅ Profile data sync (name, email, image)
- ✅ Seamless authentication flow

### Session Management
- ✅ Secure JWT sessions
- ✅ Session persistence
- ✅ "Remember me" functionality
- ✅ Automatic session refresh

## 📱 Usage

### Register New User

1. Navigate to `/register`
2. Fill in name, email, password
3. Click "Create Account" or "Sign up with Google"
4. Redirected to homepage after success

### Login

1. Navigate to `/login`
2. Enter email and password
3. Click "Log in" or "Sign in with Google"
4. Redirected to homepage after success

### Check Session

Use the `useSession` hook in any component:

```tsx
"use client";

import { useSession } from "@/lib/auth-client";

export default function MyComponent() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;

  if (!session) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <p>Welcome, {session.user.name}!</p>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
```

### Sign Out

```tsx
import { signOut } from "@/lib/auth-client";

const handleSignOut = async () => {
  await signOut();
  // User is signed out
};
```

## 🔧 Database Commands

### Push Schema
```bash
npm run db:push
```
Pushes schema changes to database (no migration files)

### Generate Migration
```bash
npm run db:generate
```
Generates SQL migration files

### Run Migrations
```bash
npm run db:migrate
```
Applies pending migrations

### Open Drizzle Studio
```bash
npm run db:studio
```
Opens visual database browser at `https://local.drizzle.studio`

## 🏗️ Project Structure

```
lib/
├── db/
│   ├── schema.ts           # Database schema
│   └── index.ts            # Drizzle client
├── auth.ts                 # Better Auth server config
└── auth-client.ts          # Better Auth client hooks

app/
├── api/
│   └── auth/
│       └── [...all]/
│           └── route.ts    # Auth API routes
├── login/
│   └── page.tsx           # Login page
└── register/
    └── page.tsx           # Register page

drizzle.config.ts          # Drizzle configuration
.env.local                 # Environment variables (create this)
```

## 🔒 Security Features

### Password Security
- ✅ Argon2 hashing (winner of Password Hashing Competition)
- ✅ Automatic salt generation
- ✅ Secure password storage

### Session Security
- ✅ HTTP-only cookies
- ✅ CSRF protection
- ✅ Secure session tokens
- ✅ Automatic expiration

### OAuth Security
- ✅ State parameter validation
- ✅ Secure token exchange
- ✅ Provider verification

## 🎨 UI Features

### Login Page
- Email/password form
- Google Sign-in button
- Error handling
- Loading states
- "Remember me" checkbox
- Link to register page

### Register Page
- Name, email, password fields
- Password confirmation
- Password strength validation
- Google Sign-up button
- Error handling
- Loading states
- Link to login page

## 🐛 Troubleshooting

### Database Connection Error
```
Error: DATABASE_URL environment variable is not set
```
**Solution**: Create `.env.local` file with DATABASE_URL

### Google OAuth Error
```
Error: GOOGLE_CLIENT_ID is not set
```
**Solution**: Add Google OAuth credentials to `.env.local`

### Session Not Persisting
**Solution**: Check that `BETTER_AUTH_SECRET` is set and consistent

### "Invalid credentials" Error
**Solution**: Ensure user exists in database and password is correct

## 📊 Database Schema Details

### User Table
```typescript
{
  id: string (CUID2)
  name: string
  email: string (unique)
  emailVerified: boolean
  image: string | null
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Session Table
```typescript
{
  id: string (CUID2)
  expiresAt: timestamp
  token: string (unique)
  userId: string (foreign key)
  ipAddress: string | null
  userAgent: string | null
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Account Table (OAuth)
```typescript
{
  id: string (CUID2)
  accountId: string
  providerId: string (e.g., "google")
  userId: string (foreign key)
  accessToken: string | null
  refreshToken: string | null
  idToken: string | null
  password: string | null (for email/password)
  createdAt: timestamp
  updatedAt: timestamp
}
```

## 🚀 Production Deployment

### Environment Variables
Update for production:
```env
BETTER_AUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
```

### Google OAuth
Add production redirect URI:
```
https://yourdomain.com/api/auth/callback/google
```

### Email Verification
Enable in production:
```typescript
// lib/auth.ts
emailAndPassword: {
  enabled: true,
  requireEmailVerification: true, // Set to true
}
```

## 📚 Additional Resources

- [Better Auth Docs](https://www.better-auth.com/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Neon Database Docs](https://neon.tech/docs/introduction)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

## ✅ Checklist

Before starting development:

- [ ] Create `.env.local` file
- [ ] Add DATABASE_URL
- [ ] Generate BETTER_AUTH_SECRET
- [ ] Set up Google OAuth credentials
- [ ] Run `npm run db:push`
- [ ] Test registration
- [ ] Test login
- [ ] Test Google OAuth
- [ ] Test logout

## 🎉 You're All Set!

Your authentication system is now ready. Users can:
- ✅ Register with email/password
- ✅ Sign in with email/password
- ✅ Sign in with Google
- ✅ Maintain secure sessions
- ✅ Sign out

Happy coding! 🚀


