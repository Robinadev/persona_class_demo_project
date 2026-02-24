// User Profile Services
export async function updateProfile(data: {
  full_name: string
  phone_number: string
  avatar_url?: string
}) {
  const response = await fetch('/api/users/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}

// Wallet Services
export async function topupWallet(data: {
  amount: number
  currency?: string
  method?: string
}) {
  const response = await fetch('/api/wallets/topup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}

// Call Services
export async function logCall(data: {
  phone_number: string
  contact_name?: string
  call_type: 'outgoing' | 'incoming' | 'missed'
  call_status: 'completed' | 'missed' | 'rejected' | 'failed'
  duration_seconds?: number
  cost?: number
}) {
  const response = await fetch('/api/calls/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}

// Money Transfer Services
export async function sendMoney(data: {
  recipient_id: string
  amount: number
  note?: string
}) {
  const response = await fetch('/api/transfers/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}

// Plan Services
export async function purchasePlan(planId: string) {
  const response = await fetch('/api/subscriptions/purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan_id: planId }),
  })
  return response.json()
}
