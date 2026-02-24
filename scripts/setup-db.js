import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  console.log('[v0] Starting database setup...')

  try {
    // Create profiles table
    console.log('[v0] Creating profiles table...')
    await supabase.rpc('create_profiles_table', {}, { shouldThrowOnError: false })

    // Create wallets table
    console.log('[v0] Creating wallets table...')
    await supabase.rpc('create_wallets_table', {}, { shouldThrowOnError: false })

    // Create plans table
    console.log('[v0] Creating plans table...')
    await supabase.rpc('create_plans_table', {}, { shouldThrowOnError: false })

    // Create subscriptions table
    console.log('[v0] Creating subscriptions table...')
    await supabase.rpc('create_subscriptions_table', {}, { shouldThrowOnError: false })

    // Create transactions table
    console.log('[v0] Creating transactions table...')
    await supabase.rpc('create_transactions_table', {}, { shouldThrowOnError: false })

    // Create calls table
    console.log('[v0] Creating calls table...')
    await supabase.rpc('create_calls_table', {}, { shouldThrowOnError: false })

    // Create contacts table
    console.log('[v0] Creating contacts table...')
    await supabase.rpc('create_contacts_table', {}, { shouldThrowOnError: false })

    // Create transfers table
    console.log('[v0] Creating transfers table...')
    await supabase.rpc('create_transfers_table', {}, { shouldThrowOnError: false })

    // Create activity_logs table
    console.log('[v0] Creating activity_logs table...')
    await supabase.rpc('create_activity_logs_table', {}, { shouldThrowOnError: false })

    // Create admin_users table
    console.log('[v0] Creating admin_users table...')
    await supabase.rpc('create_admin_users_table', {}, { shouldThrowOnError: false })

    console.log('[v0] Database setup completed successfully!')
  } catch (error) {
    console.error('[v0] Error setting up database:', error)
    process.exit(1)
  }
}

setupDatabase()
