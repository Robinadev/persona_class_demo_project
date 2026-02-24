-- Enable RLS on all tables
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY IF NOT EXISTS "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for wallets
CREATE POLICY IF NOT EXISTS "wallets_select_own" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "wallets_update_own" ON public.wallets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "wallets_insert_own" ON public.wallets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for transactions
CREATE POLICY IF NOT EXISTS "transactions_select_own" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "transactions_insert_own" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for calls
CREATE POLICY IF NOT EXISTS "calls_select_own" ON public.calls FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "calls_insert_own" ON public.calls FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for contacts
CREATE POLICY IF NOT EXISTS "contacts_select_own" ON public.contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "contacts_insert_own" ON public.contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "contacts_update_own" ON public.contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "contacts_delete_own" ON public.contacts FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for transfers
CREATE POLICY IF NOT EXISTS "transfers_select_own" ON public.transfers FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY IF NOT EXISTS "transfers_insert_own" ON public.transfers FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Create RLS policies for activity_logs
CREATE POLICY IF NOT EXISTS "activity_logs_select_own" ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "activity_logs_insert_own" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for subscriptions
CREATE POLICY IF NOT EXISTS "subscriptions_select_own" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "subscriptions_insert_own" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
