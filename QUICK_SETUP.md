# Quick Setup Instructions

## Step 1: Temporarily Disable RLS for Seeding

Run this SQL in your Supabase console:

```sql
-- Temporarily disable RLS for seeding
alter table modules disable row level security;
alter table exercises disable row level security;
```

## Step 2: Seed the Data

```bash
npm run seed-minimal
```

## Step 3: Re-enable RLS

Run this SQL in your Supabase console:

```sql
-- Re-enable RLS
alter table modules enable row level security;
alter table exercises enable row level security;
```

## Step 4: Test Your App

1. Go to http://localhost:3000
2. Create an account using Sign Up
3. Explore the fitness modules

## Your App Features:
- ✅ Authentication (login/signup)
- ✅ Fitness modules (Yoga, HIIT, Strength)
- ✅ Exercise videos and descriptions
- ✅ Responsive design

The other features (groups, wall, messages) will need the full schema.sql to be run first.