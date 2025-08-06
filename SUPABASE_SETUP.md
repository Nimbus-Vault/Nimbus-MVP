# Nimbus Vault - Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up/sign in
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - **Name**: `nimbus-vault`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
6. Click "Create new project"
7. Wait for the project to be ready (takes 1-2 minutes)

## 2. Get Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 3. Update Environment Variables

1. Open the `.env` file in the project root
2. Replace the placeholder values:
   ```env
   VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key
   ```

## 4. Run the Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire content of `Nimbus Vault DB Schema Update 3.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the schema
6. Verify all tables are created in the **Table Editor**

## 5. Enable Authentication (Optional but Recommended)

1. Go to **Authentication** → **Settings**
2. Enable **Email Auth**
3. Configure email templates if needed
4. For testing, you can disable email confirmations:
   - Set **Enable email confirmations** to OFF

## 6. Set up Row Level Security (Recommended)

The schema includes workspace-based access control. To enable RLS:

1. Go to **Authentication** → **Policies**
2. Enable RLS on the following tables:
   - workspace
   - program
   - asset
   - All template tables
   - All relationship tables

Sample RLS policy for workspace table:
```sql
CREATE POLICY "Users can view workspaces they are members of" ON workspace
FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM workspace_member WHERE workspace_id = workspace.id
  )
  OR created_by = auth.uid()
);
```

## 7. Test the Connection

1. Start the development server: `pnpm run dev`
2. Open the browser console and look for connection errors
3. Try creating a workspace to test the connection

## Troubleshooting

- **CORS errors**: Make sure your domain is allowed in Supabase settings
- **Connection timeouts**: Check your internet connection and Supabase status
- **Schema errors**: Make sure all SQL executed successfully
- **Auth errors**: Check your API keys are correctly set

## Next Steps

Once connected:
1. Create your first workspace
2. Add some sample data
3. Test all CRUD operations
4. Set up authentication if needed
