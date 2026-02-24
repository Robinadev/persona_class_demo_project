/*
  # Create Call Logs and Contacts Schema

  ## Overview
  This migration creates the calling system with call logs and contacts management.

  ## New Tables

  ### `contacts`
  User's contact list
  - `id` (uuid, primary key) - Unique contact identifier
  - `user_id` (uuid, foreign key) - References profiles.id
  - `name` (text) - Contact name
  - `phone_number` (text) - Contact phone number
  - `email` (text, nullable) - Contact email
  - `avatar_url` (text, nullable) - Contact avatar
  - `is_favorite` (boolean) - Favorite contact flag
  - `notes` (text, nullable) - Additional notes
  - `created_at` (timestamptz) - Contact creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `call_logs`
  Call history and records
  - `id` (uuid, primary key) - Unique call log identifier
  - `user_id` (uuid, foreign key) - References profiles.id
  - `contact_id` (uuid, foreign key, nullable) - References contacts.id
  - `phone_number` (text) - Called/caller phone number
  - `contact_name` (text, nullable) - Contact name at time of call
  - `call_type` (text) - Call type: outgoing, incoming, missed
  - `call_status` (text) - Call status: completed, missed, rejected, failed
  - `duration_seconds` (integer) - Call duration in seconds (0 for missed)
  - `cost` (decimal) - Call cost
  - `started_at` (timestamptz) - Call start timestamp
  - `ended_at` (timestamptz, nullable) - Call end timestamp
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on both tables
  - Users can only view and manage their own contacts and call logs

  ## Notes
  - Contacts can be linked to call logs for better UX
  - Call costs are calculated based on duration and rates
  - Missed calls have duration_seconds = 0
*/

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  phone_number text NOT NULL,
  email text,
  avatar_url text,
  is_favorite boolean DEFAULT false NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, phone_number)
);

-- Create call_logs table
CREATE TABLE IF NOT EXISTS call_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  phone_number text NOT NULL,
  contact_name text,
  call_type text NOT NULL CHECK (call_type IN ('outgoing', 'incoming', 'missed')),
  call_status text NOT NULL CHECK (call_status IN ('completed', 'missed', 'rejected', 'failed')),
  duration_seconds integer DEFAULT 0 NOT NULL CHECK (duration_seconds >= 0),
  cost decimal(10, 2) DEFAULT 0.00 NOT NULL,
  started_at timestamptz DEFAULT now() NOT NULL,
  ended_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_phone_number ON contacts(phone_number);
CREATE INDEX IF NOT EXISTS idx_contacts_is_favorite ON contacts(is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_call_logs_user_id ON call_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_phone_number ON call_logs(phone_number);
CREATE INDEX IF NOT EXISTS idx_call_logs_started_at ON call_logs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_call_logs_call_type ON call_logs(call_type);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contacts
CREATE POLICY "Users can view own contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contacts"
  ON contacts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts"
  ON contacts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own contacts"
  ON contacts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for call_logs
CREATE POLICY "Users can view own call logs"
  ON call_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own call logs"
  ON call_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own call logs"
  ON call_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own call logs"
  ON call_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add updated_at trigger to contacts
CREATE TRIGGER contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();