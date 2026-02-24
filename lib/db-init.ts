'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('[v0] Missing Supabase credentials for database initialization')
}

let initialized = false

/**
 * Initialize database schema if tables don't exist
 * This is a safe operation that checks for table existence before creating
 */
export async function initializeDatabase() {
  if (initialized || !supabaseUrl || !supabaseServiceKey) {
    return
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    console.log('[v0] Checking database schema...')

    // Check if profiles table exists
    const { data: tables } = await supabase.rpc('information_schema.tables', {
      table_schema: 'public',
    }).then(
      res => ({ data: res.data || [] }),
      () => ({ data: [] })
    )

    // If tables already exist, skip initialization
    if (tables && tables.length > 0) {
      console.log('[v0] Database schema already exists')
      initialized = true
      return
    }

    console.log('[v0] Creating database schema...')

    // Create tables using raw SQL through Supabase client
    const { error } = await supabase.rpc('create_schema', {})

    if (error && !error.message.includes('already exists')) {
      console.warn('[v0] Database initialization warning:', error.message)
    } else {
      console.log('[v0] Database schema initialized successfully')
    }

    initialized = true
  } catch (error) {
    console.warn('[v0] Could not auto-initialize database:', error instanceof Error ? error.message : 'Unknown error')
    // Don't throw - allow app to continue even if initialization fails
    initialized = true
  }
}

/**
 * Ensure a user profile exists
 */
export async function ensureUserProfile(userId: string, email: string) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()

    if (!existingProfile) {
      // Create profile
      await supabase
        .from('profiles')
        .insert({
          id: userId,
          email,
          full_name: email.split('@')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      // Create wallet
      await supabase
        .from('wallets')
        .insert({
          user_id: userId,
          balance: 0,
          currency: 'ETB',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      console.log('[v0] User profile and wallet created for:', userId)
    }
  } catch (error) {
    console.warn('[v0] Error ensuring user profile:', error instanceof Error ? error.message : 'Unknown error')
  }
}

/**
 * Health check to verify database connection
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  if (!supabaseUrl || !supabaseServiceKey) {
    return false
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    return !error
  } catch (error) {
    console.warn('[v0] Database health check failed:', error instanceof Error ? error.message : 'Unknown error')
    return false
  }
}
