'use client';

import { useEffect, useState, useCallback } from 'react';
import { subscribeToTransactions, unsubscribeFromChannel } from '@/lib/realtime';

export interface Transaction {
  id: string;
  userId: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
}

export const useRealtimeTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    
    try {
      const subscription = subscribeToTransactions((newTransaction) => {
        setTransactions((prev) => {
          // Check if transaction already exists
          const exists = prev.some((t) => t.id === newTransaction.id);
          if (exists) {
            // Update existing transaction
            return prev.map((t) =>
              t.id === newTransaction.id ? newTransaction : t
            );
          }
          // Add new transaction to the beginning
          return [newTransaction, ...prev].slice(0, 100); // Keep last 100
        });
      });

      setIsLoading(false);

      return () => {
        unsubscribeFromChannel(subscription);
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe');
      setIsLoading(false);
    }
  }, []);

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev].slice(0, 100));
  }, []);

  return {
    transactions,
    isLoading,
    error,
    addTransaction,
  };
};
