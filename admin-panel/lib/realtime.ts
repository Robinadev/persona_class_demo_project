import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface RealtimeTransaction {
  id: string;
  userId: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface RealtimeUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

export interface RealtimeWallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  updatedAt: string;
}

/**
 * Subscribe to real-time transaction updates
 */
export const subscribeToTransactions = (
  callback: (transaction: RealtimeTransaction) => void
) => {
  const subscription = supabase
    .channel('transactions')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'transactions',
      },
      (payload) => {
        callback(payload.new as RealtimeTransaction);
      }
    )
    .subscribe();

  return subscription;
};

/**
 * Subscribe to real-time user updates
 */
export const subscribeToUsers = (
  callback: (user: RealtimeUser) => void
) => {
  const subscription = supabase
    .channel('users')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'profiles',
      },
      (payload) => {
        callback(payload.new as RealtimeUser);
      }
    )
    .subscribe();

  return subscription;
};

/**
 * Subscribe to real-time wallet updates
 */
export const subscribeToWallets = (
  callback: (wallet: RealtimeWallet) => void
) => {
  const subscription = supabase
    .channel('wallets')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'wallets',
      },
      (payload) => {
        callback(payload.new as RealtimeWallet);
      }
    )
    .subscribe();

  return subscription;
};

/**
 * Subscribe to activity logs in real-time
 */
export const subscribeToActivityLogs = (
  callback: (log: any) => void
) => {
  const subscription = supabase
    .channel('activity-logs')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'activity_logs',
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return subscription;
};

/**
 * Unsubscribe from real-time updates
 */
export const unsubscribeFromChannel = async (subscription: any) => {
  if (subscription) {
    await supabase.removeChannel(subscription);
  }
};
