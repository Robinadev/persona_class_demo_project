import { Layout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const billingHistory = [
  { date: "2023-07-01", description: "Monthly Plan", amount: 19.99 },
  { date: "2023-06-15", description: "Top-Up", amount: 10.00 },
  { date: "2023-06-01", description: "Monthly Plan", amount: 19.99 },
]

export default function BillingPage() {
  return (
    <Layout>
      <div className="container py-8 md:py-12 lg:py-24">
        <h1 className="text-3xl font-bold text-center text-[#038E7D] mb-8">Billing History</h1>
        <Card className="border-[#038E7D]/10 bg-[#F0FFF9]">
          <CardHeader>
            <CardTitle className="text-[#038E7D]">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingHistory.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">${item.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
