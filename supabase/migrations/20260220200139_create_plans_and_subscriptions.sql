/*
  # Create Plans and Subscriptions Schema

  ## Overview
  This migration creates the telecom plans system and user subscriptions.

  ## New Tables

  ### `plans`
  Available telecom plans/packages
  - `id` (uuid, primary key) - Unique plan identifier
  - `name` (text) - Plan name (e.g., "Basic", "Premium")
  - `description` (text) - Plan description
  - `price` (decimal) - Plan price
  - `currency` (text) - Currency code (default: USD)
  - `duration_days` (integer) - Plan validity in days
  - `call_minutes` (integer) - Included call minutes (0 = unlimited)
  - `sms_count` (integer) - Included SMS count (0 = unlimited)
  - `data_gb` (decimal) - Included data in GB (0 = unlimited)
  - `is_active` (boolean) - Whether plan is available for purchase
  - `features` (jsonb) - Additional features as JSON
  - `created_at` (timestamptz) - Plan creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `user_subscriptions`
  User's active and historical subscriptions
  - `id` (uuid, primary key) - Unique subscription identifier
  - `user_id` (uuid, foreign key) - References profiles.id
  - `plan_id` (uuid, foreign key) - References plans.id
  - `status` (text) - Subscription status: active, expired, cancelled
  - `start_date` (timestamptz) - Subscription start date
  - `end_date` (timestamptz) - Subscription expiry date
  - `auto_renew` (boolean) - Auto-renewal flag
  - `created_at` (timestamptz) - Subscription creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on both tables
  - Plans: Public read access, admin-only write
  - User subscriptions: Users can view own subscriptions only

  ## Notes
  - Plans with duration_days=30 are monthly plans
  - Zero values for limits indicate unlimited usage
*/

-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10, 2) NOT NULL,
  currency text DEFAULT 'USD' NOT NULL,
  duration_days integer NOT NULL DEFAULT 30,
  call_minutes integer DEFAULT 0 NOT NULL,
  sms_count integer DEFAULT 0 NOT NULL,
  data_gb decimal(10, 2) DEFAULT 0 NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id uuid REFERENCES plans(id) ON DELETE RESTRICT NOT NULL,
  status text DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'expired', 'cancelled')),
  start_date timestamptz DEFAULT now() NOT NULL,
  end_date timestamptz NOT NULL,
  auto_renew boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_end_date ON user_subscriptions(end_date);

-- Enable RLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for plans
CREATE POLICY "Anyone can view active plans"
  ON plans FOR SELECT
  TO authenticated
  USING (is_active = true);

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON user_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON user_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON user_subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add updated_at triggers
CREATE TRIGGER plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insert sample plans
INSERT INTO plans (name, description, price, duration_days, call_minutes, sms_count, data_gb, features) VALUES
  ('Basic', 'Perfect for light users with essential features', 9.99, 30, 100, 100, 5.0, '["Caller ID", "Voicemail"]'::jsonb),
  ('Standard', 'Great value with unlimited calls and texts', 19.99, 30, 0, 0, 20.0, '["Unlimited Calls", "Unlimited SMS", "Caller ID", "Voicemail", "Call Waiting"]'::jsonb),
  ('Unlimited', 'Ultimate plan with unlimited everything', 29.99, 30, 0, 0, 0, '["Unlimited Calls", "Unlimited SMS", "Unlimited Data", "HD Voice", "International Calling", "Priority Support"]'::jsonb),
  ('Pay As You Go', 'No commitment, pay only for what you use', 0.00, 365, 0, 0, 0, '["No Expiry", "Flexible Usage"]'::jsonb)
ON CONFLICT DO NOTHING;