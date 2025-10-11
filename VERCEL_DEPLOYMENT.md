# Vercel Deployment Guide

## Security Checklist  ✅

### 1. Environment Variables
- ✅ `.env.local` is in `.gitignore` 
- ✅ No hardcoded credentials in code
- ✅ Admin user ID removed from SQL files

### 2. Admin Access Security
- ✅ Admin access controlled by database roles, not hardcoded
- ✅ RLS policies protect sensitive data
- ✅ Admin views use proper authentication

## Deployment Steps

### 1. Prepare Repository
```bash
# Add all files and commit changes
git add .
git commit -m "Add gitignore and security fixes"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI
```bash
npm install -g vercel
cd fitness-app
vercel
```

#### Option B: GitHub Integration
1. Push code to GitHub
2. Connect repository to Vercel
3. Import project

### 3. Configure Environment Variables in Vercel
Go to Vercel Dashboard → Project → Settings → Environment Variables

Add these variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://mnfmaonfzbpoqdvcxrmn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZm1hb25memJwb3FkdmN4cm1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNDY1NjYsImV4cCI6MjA3NTcyMjU2Nn0.ANRCN2VFTiUKNgxe8eLaziQ6mGWYfmRLWe4ezNVji9g
```

### 4. Set Up Admin Access
After deployment, create your admin user:

1. Sign up on your deployed app
2. Get your user ID from Supabase Auth dashboard
3. Run this SQL in Supabase SQL Editor:
```sql
INSERT INTO user_roles (user_id, role) 
VALUES ('YOUR_USER_ID_HERE', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

### 5. Configure Supabase for Production

#### Update Supabase Settings:
1. **Site URL**: Add your Vercel domain to Supabase Auth settings
2. **Redirect URLs**: Add `https://your-app.vercel.app/auth/callback`
3. **CORS**: Ensure your domain is allowed

#### Database Setup:
Run these SQL files in order:
1. `supabase/collaborative-schema.sql`
2. `supabase/progress-tracking.sql`
3. `supabase/complete-admin-fix.sql` (without the hardcoded user ID)
4. `supabase/ban-system.sql`
5. `supabase/user-view.sql`

### 6. Verify Deployment

Test these features:
- ✅ User registration/login
- ✅ Session creation and joining
- ✅ Real-time chat and video sync
- ✅ Admin dashboard access
- ✅ Module and exercise management

## Security Notes

### What's Protected:
- ✅ Database credentials (server-side only)
- ✅ Admin access (role-based, not hardcoded)
- ✅ User data (RLS policies)
- ✅ API keys (environment variables)

### Public Information:
- ✅ Supabase URL and anon key (safe to expose)
- ✅ App functionality (intended to be public)

### Admin Security:
- Admin access is controlled by `user_roles` table
- No admin credentials exposed in client code
- RLS policies prevent unauthorized access
- Ban system protects against abuse

## Troubleshooting

### Common Issues:
1. **Build Errors**: Check environment variables are set
2. **Auth Issues**: Verify Supabase site URL configuration
3. **Admin Access**: Ensure user role is set in database
4. **Real-time**: Check Supabase real-time is enabled

### Support:
- Check Vercel deployment logs
- Monitor Supabase logs for database issues
- Test locally first with production environment variables