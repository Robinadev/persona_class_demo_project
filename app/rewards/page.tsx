import { Layout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const rewards = [
  { name: "Free Minutes", progress: 60, total: 100, unit: "minutes" },
  { name: "Cashback", progress: 25, total: 50, unit: "$" },
  { name: "Referral Bonus", progress: 3, total: 5, unit: "friends" },
]

export default function RewardsPage() {
  return (
    <Layout>
      <div className="container py-8 md:py-12 lg:py-24">
        <h1 className="text-3xl font-bold text-center text-[#038E7D] mb-8">Your Rewards</h1>
        <div className="space-y-6 max-w-md mx-auto">
          {rewards.map((reward, index) => (
            <Card key={index} className="border-[#038E7D]/10 bg-[#F0FFF9]">
              <CardHeader>
                <CardTitle className="text-[#038E7D]">{reward.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={(reward.progress / reward.total) * 100} className="h-2 mb-2" />
                <p className="text-[#025E52]">
                  {reward.progress} / {reward.total} {reward.unit}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}
