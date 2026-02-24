/*
  # Create Wallet and Transactions Schema

  ## Overview
  This migration creates the wallet system for managing user balances and transaction history.

  ## New Tables

  ### `wallets`
  User wallet balances
  - `id` (uuid, primary key) - Unique wallet identifier
  - `user_id` (uuid, foreign key) - References profiles.id (unique)
  - `balance` (decimal) - Current wallet balance
  - `currency` (text) - Currency code (default: USD)
  - `created_at` (timestamptz) - Wallet creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `transactions`
  All financial transactions (top-ups, recharges, transfers, payments)
  - `id` (uuid, primary key) - Unique transaction identifier
  - `user_id` (uuid, foreign key) - References profiles.id
  - `wallet_id` (uuid, foreign key) - References wallets.id
  - `type` (text) - Transaction type: top_up, recharge, send_money, receive_money, plan_purchase, call_charge
  - `amount` (decimal) - Transaction amount (positive for credit, negative for debit)
  - `balance_before` (decimal) - Balance before transaction
  - `balance_after` (decimal) - Balance after transaction
  - `status` (text) - Transaction status: pending, completed, failed, cancelled
  - `description` (text) - Transaction description
  - `metadata` (jsonb) - Additional transaction details (recipient, phone number, etc.)
  - `reference_id` (text, nullable) - External reference (e.g., Stripe payment ID)
  - `created_at` (timestamptz) - Transaction timestamp

  ### `money_transfers`
  Money transfer records between users
  - `id` (uuid, primary key) - Unique transfer identifier
  - `sender_id` (uuid, foreign key) - References profiles.id
  - `recipient_id` (uuid, foreign key) - References profiles.id
  - `amount` (decimal) - Transfer amount
  - `status` (text) - Transfer status: pending, completed, failed, cancelled
  - `note` (text, nullable) - Optional transfer note
  - `transaction_id` (uuid, foreign key) - References transactions.id
  - `created_at` (timestamptz) - Transfer timestamp
  - `completed_at` (timestamptz, nullable) - Completion timestamp

  ## Security
  - Enable RLS on all tables
  - Users can only view their own wallet and transactions
  - Transfers require proper balance validation

  ## Notes
  - Wallet is automatically created when user profile is created
  - All balance changes must be recorded as transactions
  - Negative amounts represent debits, positive represent credits
*/

-- Create wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  balance decimal(10, 2) DEFAULT 0.00 NOT NULL CHECK (balance >= 0),
  currency text DEFAULT 'USD' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  wallet_id uuid REFERENCES wallets(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('top_up', 'recharge', 'send_money', 'receive_money', 'plan_purchase', 'call_charge')),
  amount decimal(10, 2) NOT NULL,
  balance_before decimal(10, 2) NOT NULL,
  balance_after decimal(10, 2) NOT NULL,
  status text DEFAULT 'completed' NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  description text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  reference_id text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create money_transfers table
CREATE TABLE IF NOT EXISTS money_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10, 2) NOT NULL CHECK (amount > 0),
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  note text,
  transaction_id uuid REFERENCES transactions(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz,
  CONSTRAINT no_self_transfer CHECK (sender_id != recipient_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_money_transfers_sender_id ON money_transfers(sender_id);
CREATE INDEX IF NOT EXISTS idx_money_transfers_recipient_id ON money_transfers(recipient_id);
CREATE INDEX IF NOT EXISTS idx_money_transfers_status ON money_transfers(status);

-- Enable RLS
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE money_transfers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wallets
CREATE POLICY "Users can view own wallet"
  ON wallets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet"
  ON wallets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for money_transfers
CREATE POLICY "Users can view transfers they sent or received"
  ON money_transfers FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create transfers they send"
  ON money_transfers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update transfers they sent"
  ON money_transfers FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);

-- Add updated_at trigger to wallets
CREATE TRIGGER wallets_updated_at
  BEFORE UPDATE ON wallets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create function to handle wallet creation for new users
CREATE OR REPLACE FUNCTION create_wallet_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wallets (user_id, balance)
  VALUES (NEW.id, 0.00);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic wallet creation
DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_wallet_for_user();