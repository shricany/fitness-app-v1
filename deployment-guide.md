# Deployment Guide: Fitness/Health SaaS App

This guide provides step-by-step instructions for deploying the application using Supabase for the backend and Vercel for the frontend and hosting. This guide assumes you have a GitHub account and have pushed your project code to a repository.

## Part 1: Setting Up Your Supabase Backend

Supabase will handle our database, user authentication, and file storage.

### Step 1: Create a Supabase Account and Project

1.  Go to [supabase.com](https://supabase.com) and sign up for a free account.
2.  Once logged in, you'll be on your dashboard. Click on **"New Project"**.
3.  Choose an organization (you can create one if you don't have one).
4.  Fill in the project details:
    *   **Name:** `Fitness-App` (or any name you prefer).
    *   **Database Password:** Generate a strong, secure password and **save it somewhere safe**. You will need this for direct database access, but not for connecting your app.
    *   **Region:** Choose the region closest to your users for the best performance.
5.  Click **"Create Project"**. It will take a few minutes for your project to be set up.

### Step 2: Get Your API Keys

Once your project is ready, you need to get the API keys to connect your Next.js application to Supabase.

1.  In your Supabase project dashboard, go to the **Settings** (the gear icon in the left sidebar).
2.  Click on **"API"** in the settings menu.
3.  You will see your **Project API keys**. You need two things from this page:
    *   **Project URL:** It will look like `https://<your-project-ref>.supabase.co`.
    *   **`anon` `public` Key:** This is the public key that is safe to use in a browser.
4.  Keep this page open or copy these two values. We will need them later.

### Step 3: Set Up the Database Schema

We need to create the tables in our database to store data for users, modules, exercises, etc.

1.  In your Supabase project dashboard, go to the **Table Editor** (the table icon in the left sidebar).
2.  Click on **"New table"** to create each of the following tables.
    *   `users` (Supabase Auth handles this, but you might want a `profiles` table linked to it)
    *   `modules`
    *   `exercises`
    *   `groups`
    *   `upvotes`
    *   `walls`
3.  For each table, you will need to define the columns. You can use the SQL editor for a faster setup. Go to the **SQL Editor** (the SQL icon) and run the SQL script that defines your schema.

### Step 4: Enable Realtime and Storage

1.  **Realtime:**
    *   Go to **Database** -> **Replication**.
    *   Ensure that replication is enabled for your tables to get real-time updates.
2.  **Storage (for videos):**
    *   Go to the **Storage** section (the folder icon).
    *   Click **"New bucket"**.
    *   Name the bucket `videos` (or something similar) and make it **public** if you want videos to be easily accessible. You can set up more complex access rules later.

## Part 2: Deploying Your App with Vercel

Vercel will host our Next.js application and automatically handle deployments when we push code to GitHub.

### Step 1: Create a Vercel Account

1.  Go to [vercel.com](https://vercel.com) and sign up for a free account. It's easiest to sign up using your GitHub account.

### Step 2: Import Your Project

1.  On your Vercel dashboard, click **"Add New..."** -> **"Project"**.
2.  Vercel will show you a list of your GitHub repositories. Find your fitness app repository and click **"Import"**.
3.  Vercel will automatically detect that it's a Next.js project and configure the build settings for you. You usually don't need to change anything here.

### Step 3: Configure Environment Variables

This is the most important step for connecting your frontend (on Vercel) to your backend (on Supabase).

1.  In the project import screen, expand the **"Environment Variables"** section.
2.  We need to add the Supabase URL and `anon` key that we copied earlier.
3.  Add the following two environment variables:
    *   **Name:** `NEXT_PUBLIC_SUPABASE_URL`
    *   **Value:** Paste your Supabase Project URL here.
    *   **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    *   **Value:** Paste your Supabase `anon` `public` key here.

    *(Note: The `NEXT_PUBLIC_` prefix is important in Next.js to make these variables accessible in the browser.)*

### Step 4: Deploy!

1.  Click the **"Deploy"** button.
2.  Vercel will now build and deploy your application. You can watch the build logs in real-time.
3.  Once the deployment is complete, you'll get a URL where you can see your live application (e.g., `fitness-app.vercel.app`).

## Part 3: After Deployment

### Continuous Deployment (CI/CD)

Now that your project is connected, every time you push a new commit to your main branch on GitHub, Vercel will automatically trigger a new deployment with the latest changes.

### Monitoring

-   Use the **Vercel dashboard** to monitor your deployments, check logs, and view analytics.
-   Use the **Supabase dashboard** to monitor your database usage, check API requests, and manage your data.

That's it! Your Fitness SaaS App is now live.
