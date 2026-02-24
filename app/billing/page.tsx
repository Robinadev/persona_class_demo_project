'use client'

import { Layout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTransactionHistory, useWalletBalance } from "@/lib/hooks/useUserProfile"
import { formatDistanceToNow } from 'date-fns'

export default function BillingPage() {
  const { transactions, isLoading } = useTransactionHistory()
  const { balance, currency } = useWalletBalance()

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'top_up':
        return '⬆️'
      case 'plan_purchase':
        return '📱'
      case 'call_charge':
        return '☎️'
      case 'send_money':
        return '📤'
      case 'receive_money':
        return '📥'
      default:
        return '💳'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'top_up':
        return 'Top-Up'
      case 'plan_purchase':
        return 'Plan Purchase'
      case 'call_charge':
        return 'Call Charge'
      case 'send_money':
        return 'Money Sent'
      case 'receive_money':
        return 'Money Received'
      default:
        return 'Transaction'
    }
  }

  return (
    <Layout>
      <div className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Wallet Balance Card */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-primary/20 shadow-lg md:col-span-2">
              <CardHeader className="bg-gradient-to-r from-primary via-secondary to-accent text-white">
                <CardTitle>Wallet Balance</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">{balance.toFixed(2)}</span>
                  <span className="text-lg text-muted-foreground">{currency}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b">
              <CardTitle className="text-primary">Transaction History</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="text-center text-muted-foreground py-8">
                  Loading transactions...
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No transactions yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-primary/10">
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((item: any) => (
                        <TableRow key={item.id} className="border-primary/5">
                          <TableCell className="text-sm">
                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            <span className="mr-2">{getTransactionIcon(item.type)}</span>
                            {getTypeLabel(item.type)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {item.description}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            <span className={item.type.includes('send') || item.type === 'call_charge' || item.type === 'plan_purchase' ? 'text-destructive' : 'text-accent'}>
                              {item.type.includes('send') || item.type === 'call_charge' || item.type === 'plan_purchase' ? '-' : '+'}
                              {item.amount.toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'completed'
                                ? 'bg-accent/10 text-accent'
                                : item.status === 'pending'
                                ? 'bg-secondary/10 text-secondary'
                                : 'bg-destructive/10 text-destructive'
                            }`}>
                              {item.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
