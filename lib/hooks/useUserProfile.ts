import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useUserProfile() {
  const { data, error, isLoading, mutate } = useSWR('/api/users/profile', fetcher)

  return {
    profile: data?.data,
    isLoading,
    error,
    mutate,
  }
}

export function useWalletBalance() {
  const { data, error, isLoading, mutate } = useSWR('/api/wallets/balance', fetcher)

  return {
    balance: data?.data?.balance || 0,
    currency: data?.data?.currency || 'ETB',
    isLoading,
    error,
    mutate,
  }
}

export function useCallLogs() {
  const { data, error, isLoading, mutate } = useSWR('/api/calls/log?limit=20', fetcher)

  return {
    calls: data?.data || [],
    isLoading,
    error,
    mutate,
  }
}

export function useTransactionHistory(limit = 50) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/transactions/history?limit=${limit}`,
    fetcher
  )

  return {
    transactions: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    mutate,
  }
}

export function useUserSubscriptions() {
  const { data, error, isLoading, mutate } = useSWR('/api/subscriptions/purchase', fetcher)

  return {
    subscriptions: data?.data || [],
    isLoading,
    error,
    mutate,
  }
}

export function usePlans() {
  const { data, error, isLoading } = useSWR('/api/plans/list', fetcher)

  return {
    plans: data?.data || [],
    isLoading,
    error,
  }
}
