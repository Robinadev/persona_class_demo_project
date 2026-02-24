/*
  # Create Admin Users and Activity Logs Schema

  ## Overview
  This migration creates the admin management system and activity tracking.

  ## New Tables

  ### `admin_users`
  Admin user accounts with role-based access
  - `id` (uuid, primary key) - Unique admin identifier
  - `user_id` (uuid, foreign key, nullable) - References profiles.id (for admins who are also users)
  - `username` (text) - Admin username (unique)
  - `email` (text) - Admin email (unique)
  - `password_hash` (text) - Hashed password
  - `full_name` (text) - Admin full name
  - `role` (text) - Admin role: super_admin, admin, support
  - `is_active` (boolean) - Active status
  - `last_login_at` (timestamptz, nullable) - Last login timestamp
  - `created_at` (timestamptz) - Admin creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `activity_logs`
  User and admin activity tracking
  - `id` (uuid, primary key) - Unique log identifier
  - `user_id` (uuid, foreign key, nullable) - References profiles.id
  - `admin_id` (uuid, foreign key, nullable) - References admin_users.id
  - `action` (text) - Action performed (e.g., login, logout, top_up, call, etc.)
  - `resource_type` (text, nullable) - Resource type (e.g., user, transaction, plan)
  - `resource_id` (text, nullable) - Resource identifier
  - `details` (jsonb) - Additional action details
  - `ip_address` (text, nullable) - IP address
  - `user_agent` (text, nullable) - User agent string
  - `created_at` (timestamptz) - Activity timestamp

  ## Security
  - Enable RLS on both tables
  - Admin users table: No direct access from client (server-only)
  - Activity logs: Users can view own logs, admins need server-side access

  ## Notes
  - Admin authentication is handled separately from user auth
  - Activity logs track both user and admin actions
  - Super admins have full access, admins have limited access, support has read-only
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'support' NOT NULL CHECK (role IN ('super_admin', 'admin', 'support')),
  is_active boolean DEFAULT true NOT NULL,
  last_login_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  admin_id uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text,
  resource_id text,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now() NOT NULL,
  CHECK (user_id IS NOT NULL OR admin_id IS NOT NULL)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_admin_id ON activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users
-- No client access - admin auth handled server-side only
CREATE POLICY "No direct client access to admin users"
  ON admin_users FOR ALL
  TO authenticated
  USING (false);

-- RLS Policies for activity_logs
CREATE POLICY "Users can view own activity logs"
  ON activity_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Add updated_at trigger to admin_users
CREATE TRIGGER admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create function to log activity
CREATE OR REPLACE FUNCTION log_activity(
  p_user_id uuid,
  p_admin_id uuid,
  p_action text,
  p_resource_type text DEFAULT NULL,
  p_resource_id text DEFAULT NULL,
  p_details jsonb DEFAULT '{}'::jsonb,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO activity_logs (
    user_id,
    admin_id,
    action,
    resource_type,
    resource_id,
    details,
    ip_address,
    user_agent
  ) VALUES (
    p_user_id,
    p_admin_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_details,
    p_ip_address,
    p_user_agent
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;