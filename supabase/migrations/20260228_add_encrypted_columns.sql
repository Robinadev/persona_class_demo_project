-- Helper function to check admin role (create first before using)
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add encrypted columns for sensitive PII to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_encrypted JSONB;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_hash VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ssn_encrypted JSONB;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ssn_hash VARCHAR(255);

-- Create payment_methods table with encrypted data
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  method_type VARCHAR(50) NOT NULL, -- 'bank_account', 'card', 'wallet'
  account_number_encrypted JSONB,
  account_number_hash VARCHAR(255),
  account_name VARCHAR(255),
  bank_code VARCHAR(10),
  is_default BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sensitive_data_logs table for audit trail
CREATE TABLE IF NOT EXISTS sensitive_data_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  data_type VARCHAR(50) NOT NULL, -- 'phone', 'ssn', 'payment_method'
  action VARCHAR(50) NOT NULL, -- 'view', 'update', 'encrypt', 'decrypt'
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_is_default ON payment_methods(is_default);
CREATE INDEX IF NOT EXISTS idx_sensitive_data_logs_user_id ON sensitive_data_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sensitive_data_logs_action ON sensitive_data_logs(action);

-- Enable RLS on new tables
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensitive_data_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own payment methods
CREATE POLICY "Users can view own payment methods" ON payment_methods
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own payment methods
CREATE POLICY "Users can insert payment methods" ON payment_methods
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own payment methods
CREATE POLICY "Users can update payment methods" ON payment_methods
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own payment methods
CREATE POLICY "Users can delete payment methods" ON payment_methods
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policy: Users can view their own sensitive data logs
CREATE POLICY "Users can view own sensitive data logs" ON sensitive_data_logs
  FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

-- RLS Policy: Admins can insert logs for any user
CREATE POLICY "Admins can insert sensitive data logs" ON sensitive_data_logs
  FOR INSERT
  WITH CHECK (is_admin());

-- Update profiles table with encryption audit
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS encryption_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_encryption_update TIMESTAMP WITH TIME ZONE;

COMMENT ON TABLE payment_methods IS 'Stores encrypted payment method information with audit trail';
COMMENT ON TABLE sensitive_data_logs IS 'Audit log for sensitive PII access and modifications';
COMMENT ON COLUMN profiles.phone_encrypted IS 'AES-256-GCM encrypted phone number with IV and auth tag';
COMMENT ON COLUMN profiles.ssn_encrypted IS 'AES-256-GCM encrypted SSN with IV and auth tag';
