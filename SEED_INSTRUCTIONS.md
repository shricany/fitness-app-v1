# Complete Data Seeding Instructions

## Step 1: Temporarily Disable RLS

Run this SQL in    Supabase console:

```sql
-- Disable RLS for seeding
alter table modules disable row level security;
alter table exercises disable row level security;
alter table groups disable row level security;
alter table group_members disable row level security;
alter table upvotes disable row level security;
alter table walls disable row level security;
alter table messages disable row level security;
```

## Step 2: Seed All Data

```bash
npm run seed-everything
```

## Step 3: Re-enable RLS

Run this SQL in Supabase console:

```sql
-- Re-enable RLS
alter table modules enable row level security;
alter table exercises enable row level security;
alter table groups enable row level security;
alter table group_members enable row level security;
alter table upvotes enable row level security;
alter table walls enable row level security;
alter table messages enable row level security;
```

## Step 4: Test Your App

- **Demo Account:** demo@fitness.app / demo123456
- **Features:** All modules, exercises, groups, upvotes, wall posts, and messages
- **URL:** http://localhost:3000

Your fitness app will be fully populated with realistic demo data!