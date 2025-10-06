# 🧪 Authentication Testing Guide

## ✅ Pre-Test Checklist

### 1. Environment Setup
- ✅ `.env.local` exists with all required variables
- ✅ Database tables created (user, session, account, verification)
- ✅ Better Auth configured with email/password provider
- ✅ Google OAuth configured (optional)

### 2. Database Status
Run this command to verify database connection:
```bash
npm run db:studio
```
This will open Drizzle Studio at `https://local.drizzle.studio`

### 3. Start Development Server
```bash
npm run dev
```
Server will run at `http://localhost:3000`

---

## 🧪 Test Scenarios

### Test 1: User Registration (Email/Password)

**Steps:**
1. Navigate to `http://localhost:3000/register`
2. Fill in the registration form:
   - **Name**: Test User
   - **Email**: test@example.com
   - **Password**: TestPassword123!
   - **Confirm Password**: TestPassword123!
3. Click "Create Account"

**Expected Results:**
- ✅ Form validates password length (min 8 characters)
- ✅ Form validates password match
- ✅ User is created in the database
- ✅ User is automatically logged in
- ✅ Redirected to homepage (`/`)
- ✅ Navbar shows user menu with name/email

**Error Cases to Test:**
- ❌ Passwords don't match → Shows error message
- ❌ Password too short (< 8 chars) → Shows error message
- ❌ Email already exists → Shows "Failed to create account" error
- ❌ Invalid email format → Browser validation

---

### Test 2: User Login (Email/Password)

**Steps:**
1. Navigate to `http://localhost:3000/login`
2. Fill in the login form:
   - **Email**: test@example.com
   - **Password**: TestPassword123!
3. Click "Log in"

**Expected Results:**
- ✅ User is authenticated
- ✅ Session is created in database
- ✅ Redirected to homepage (`/`)
- ✅ Navbar shows user menu with name/email
- ✅ UserMenu dropdown shows "Sign out" option

**Error Cases to Test:**
- ❌ Wrong password → Shows "Failed to sign in" error
- ❌ Non-existent email → Shows error message
- ❌ Empty fields → Browser validation

---

### Test 3: User Session Persistence

**Steps:**
1. Log in successfully
2. Navigate to different pages:
   - `/search`
   - `/search?category=Screws`
   - `/product/[any-sku]`
3. Refresh the page (F5)
4. Close and reopen the browser tab

**Expected Results:**
- ✅ User remains logged in across page navigation
- ✅ User remains logged in after page refresh
- ✅ User session persists after closing/reopening tab
- ✅ UserMenu always shows correct user info

---

### Test 4: User Logout

**Steps:**
1. Log in successfully
2. Click on the UserMenu in the navbar
3. Click "Sign out"

**Expected Results:**
- ✅ User is logged out
- ✅ Session is removed from database
- ✅ Redirected to homepage
- ✅ Navbar shows "Register" button again (no UserMenu)
- ✅ Trying to access protected routes redirects to login

---

### Test 5: Google OAuth Sign-In (Optional)

**Prerequisites:**
- Google OAuth credentials must be configured in `.env.local`
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` must be valid

**Steps:**
1. Navigate to `http://localhost:3000/login` or `/register`
2. Click "Continue with Google"
3. Complete Google sign-in flow
4. Authorize the app

**Expected Results:**
- ✅ Redirects to Google sign-in page
- ✅ After authorization, redirects back to app
- ✅ User is logged in
- ✅ User account created in database
- ✅ Account linked in `account` table
- ✅ Navbar shows user info from Google profile

**Note:** If Google OAuth is not configured, the button will show an error.

---

## 🔍 Database Verification

### Check User Creation
1. Open Drizzle Studio: `npm run db:studio`
2. Navigate to the `user` table
3. Verify new user entries:
   - `id`: CUID
   - `email`: User's email
   - `name`: User's name
   - `emailVerified`: false (or true if verified)
   - `image`: null (or Google profile pic for OAuth)
   - `createdAt`: Timestamp
   - `updatedAt`: Timestamp

### Check Session Creation
1. In Drizzle Studio, navigate to `session` table
2. After login, verify session entry:
   - `id`: CUID
   - `userId`: Matches user ID
   - `expiresAt`: Future timestamp
   - `token`: Session token
   - `ipAddress`: User's IP
   - `userAgent`: Browser info

### Check Account Linking (Google OAuth)
1. In Drizzle Studio, navigate to `account` table
2. For Google sign-in, verify:
   - `id`: CUID
   - `userId`: Matches user ID
   - `accountId`: Google account ID
   - `providerId`: "google"
   - `accessToken`: Present
   - `refreshToken`: May be present
   - `expiresAt`: Token expiration

---

## 🐛 Common Issues & Solutions

### Issue 1: "Database connection failed"
**Solution:**
- Verify `DATABASE_URL` in `.env.local` is correct
- Check database is accessible
- Run `npm run db:push` to apply schema

### Issue 2: "BETTER_AUTH_SECRET is not set"
**Solution:**
- Ensure `.env.local` has `BETTER_AUTH_SECRET`
- Generate new secret: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- Restart dev server after adding

### Issue 3: "Failed to create account" on registration
**Possible Causes:**
- Email already exists in database
- Database connection issue
- Schema not applied

**Solution:**
- Check Drizzle Studio for existing email
- Verify database tables exist
- Run `npm run db:push`

### Issue 4: Google OAuth not working
**Solution:**
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- Ensure redirect URI in Google Console matches: `http://localhost:3000/api/auth/callback/google`
- Check Google OAuth consent screen is configured

### Issue 5: User not redirecting after login/register
**Solution:**
- Check browser console for errors
- Verify `callbackURL` in auth-client calls
- Ensure router.push("/") executes

### Issue 6: Session not persisting
**Solution:**
- Check browser cookies are enabled
- Verify session table has entry
- Check session expiration time
- Ensure `useSession()` hook is used correctly

---

## 📊 Testing Checklist

Use this checklist to verify all functionality:

### Registration
- [ ] Can access registration page
- [ ] Form validates all fields
- [ ] Password strength validation works
- [ ] Password match validation works
- [ ] Successful registration creates user in DB
- [ ] User is auto-logged in after registration
- [ ] Redirects to homepage after success
- [ ] Shows error for duplicate email

### Login
- [ ] Can access login page
- [ ] Form validates email format
- [ ] Successful login with correct credentials
- [ ] Shows error for wrong password
- [ ] Shows error for non-existent email
- [ ] Redirects to homepage after success
- [ ] Session is created in database

### Session Management
- [ ] Session persists across page navigation
- [ ] Session persists after page refresh
- [ ] Session persists after closing/reopening tab
- [ ] UserMenu shows correct user information
- [ ] Session expires after configured time

### Logout
- [ ] Logout button is visible in UserMenu
- [ ] Clicking logout signs user out
- [ ] Session is removed from database
- [ ] Navbar updates to show Register button
- [ ] User is redirected appropriately

### Google OAuth (if configured)
- [ ] Google sign-in button appears
- [ ] Clicking redirects to Google
- [ ] Successful OAuth flow completes
- [ ] User account is created/linked
- [ ] User is logged in after OAuth
- [ ] Account entry created in DB

### UI/UX
- [ ] All buttons have proper styling
- [ ] Loading states show during requests
- [ ] Error messages display clearly
- [ ] Form validation is user-friendly
- [ ] Mobile responsive design works
- [ ] Navbar updates correctly on auth state change

---

## 🎯 Manual Testing Steps

### Quick Test Flow:
1. **Start server**: `npm run dev`
2. **Register new user**: 
   - Go to `/register`
   - Create account with test@buildpro.com
3. **Verify logged in**:
   - Check navbar shows user menu
   - Navigate to different pages
4. **Logout**:
   - Click user menu → Sign out
   - Verify logged out
5. **Login again**:
   - Go to `/login`
   - Sign in with same credentials
6. **Check persistence**:
   - Refresh page
   - Close and reopen browser
7. **Success!** ✅

---

## 📝 Test Results Template

Date: ___________  
Tester: ___________

| Test Case | Status | Notes |
|-----------|--------|-------|
| Registration - Valid | ⬜ Pass / ⬜ Fail | |
| Registration - Validation | ⬜ Pass / ⬜ Fail | |
| Login - Valid | ⬜ Pass / ⬜ Fail | |
| Login - Invalid | ⬜ Pass / ⬜ Fail | |
| Session Persistence | ⬜ Pass / ⬜ Fail | |
| Logout | ⬜ Pass / ⬜ Fail | |
| Google OAuth | ⬜ Pass / ⬜ Fail / ⬜ N/A | |
| UI/UX | ⬜ Pass / ⬜ Fail | |

**Overall Result:** ⬜ All Tests Passed / ⬜ Some Failed

**Notes:**
_______________________________________
_______________________________________
_______________________________________



