# 🔐 Security Setup Guide

## ⚠️ Important Security Notice

**The admin panel is now protected with email-based access control.** Only users with whitelisted admin emails can access the administration features.

## 🛡️ Admin Access Configuration

### Method 1: Environment Variable (Recommended for Production)

1. Create a `.env` file in the project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Admin Email Whitelist (comma-separated, no spaces)
VITE_ADMIN_EMAILS=admin@example.com,owner@example.com
```

2. Restart your development server after creating/updating the `.env` file.

### Method 2: Hardcode in Code (For Development Only)

Edit `src/hooks/useAuth.ts` and add admin emails directly to the array:

```typescript
const ADMIN_EMAILS = [
  "admin@example.com",
  "owner@example.com",
  // Add more admin emails here
];
```

⚠️ **Warning**: Hardcoding emails is less secure and should only be used during development. For production, always use environment variables.

## 🔒 How It Works

1. **Authentication Check**: User must be logged in (authenticated)
2. **Authorization Check**: User's email must be in the admin whitelist
3. **Access Denied**: If authenticated but not admin → redirected to home page
4. **Signup Protection**: Public signup is disabled - only admin emails can register

## 📋 Setup Steps

### Step 1: Configure Admin Emails

Choose either Method 1 (environment variable) or Method 2 (hardcode) above.

### Step 2: Create Admin Accounts

1. Go to `/admin/login`
2. Click "회원가입" (Sign up)
3. Enter an admin email (must be in whitelist)
4. Enter a password (minimum 6 characters)
5. Complete signup

### Step 3: Verify Access

1. Log in with your admin credentials
2. You should be redirected to `/admin` dashboard
3. If you see the dashboard, setup is successful ✅

## 🚫 Access Restrictions

- **Public Users**: Can only view published artworks on the homepage
- **Authenticated Non-Admins**: Cannot access admin routes (redirected to home)
- **Admins**: Full access to all admin features (CRUD operations)

## 🛠️ Troubleshooting

### "관리자 권한이 필요합니다" Error

- **Cause**: Your email is not in the admin whitelist
- **Solution**: Add your email to `VITE_ADMIN_EMAILS` or the hardcoded array

### Signup Fails with "관리자만 가능합니다"

- **Cause**: Trying to signup with non-admin email
- **Solution**: Use an email address that's in the admin whitelist

### Environment Variable Not Working

1. Ensure `.env` file is in the project root (same level as `package.json`)
2. Variable names must start with `VITE_` for Vite to expose them
3. Restart the dev server after changing `.env`
4. Check for typos in email addresses (case-insensitive matching)

## 🔐 Database-Level Security

In addition to frontend checks, the database also has Row Level Security (RLS) policies:

- **Public**: Can only SELECT published artworks
- **Authenticated**: Can SELECT all artworks
- **Authenticated + Admin Check**: Should be verified at application level (current implementation)

### Recommended: Enhanced Database Security

For better security, consider creating a `user_roles` table in Supabase and checking roles in RLS policies:

```sql
-- Create user_roles table (run in Supabase SQL editor)
CREATE TABLE public.user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create admin role for specific users
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'admin@example.com';

-- Update RLS policies to check role
-- (This requires updating the migration file)
```

## 📝 Notes

- Email matching is **case-insensitive**
- Admin emails should not have leading/trailing spaces
- Multiple admins can be added (comma-separated in env var, or array in code)
- Changes to admin list require server restart (if using env vars)

## 🔄 Migration from Previous Version

If you had existing admin accounts before this security update:

1. They will still be able to log in
2. However, they will be redirected to home page if their email is not in the whitelist
3. Add their emails to the admin whitelist to restore access

---

**Last Updated**: January 2025


