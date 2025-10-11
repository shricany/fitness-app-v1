# Database Setup Instructions

## Step 1: Create Database Tables

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `mnfmaonfzbpoqdvcxrmn`
3. Navigate to **SQL Editor** in the left sidebar
4. Copy the entire contents of `supabase/schema.sql`
5. Paste it into the SQL Editor
6. Click **Run** to execute the SQL

## Step 2: Seed the Database (Optional)

After creating the tables, run:
```bash
npm run seed
```

## Step 3: Start the Development Server

```bash
npm run dev
```

## Troubleshooting

If you encounter any issues:
1. Make sure all tables are created in Supabase
2. Check that RLS policies are enabled
3. Verify your environment variables in `.env.local`

## Quick Test

To test if your Supabase connection is working:
```bash
npm run test-connection
```