"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, DollarSign, TrendingUp } from "lucide-react"

const plans = [
  { name: "Basic", price: 9.99, minutes: 100, subscribers: 1200, revenue: 11988 },
  { name: "Standard", price: 19.99, minutes: 300, subscribers: 2450, revenue: 48975 },
  { name: "Premium", price: 29.99, minutes: 600, subscribers: 1850, revenue: 55482 },
  { name: "Pro", price: 49.99, minutes: 1500, subscribers: 850, revenue: 42491 },
]

export default function PlansPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 bg-clip-text text-transparent">Plans & Subscriptions</h2>
        <p className="text-gray-600 mt-1">Manage subscription plans and pricing tiers</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan, idx) => (
          <Card key={idx} className={`border-2 ${idx === 2 ? 'border-red-200' : 'border-gray-200'} bg-white/80 backdrop-blur hover:shadow-lg transition-all`}>
            <CardHeader className={`bg-gradient-to-r ${
              idx === 0 ? 'from-red-50 to-yellow-50' :
              idx === 1 ? 'from-yellow-50 to-green-50' :
              idx === 2 ? 'from-green-50 to-blue-50' :
              'from-blue-50 to-purple-50'
            } border-b`}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900">{plan.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">ETB {plan.price.toFixed(2)}/month</p>
                </div>
                <Package className={`h-6 w-6 ${
                  idx === 0 ? 'text-red-600' :
                  idx === 1 ? 'text-yellow-600' :
                  idx === 2 ? 'text-green-600' :
                  'text-blue-600'
                }`} />
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Minutes Included</span>
                <span className="font-bold text-gray-900">{plan.minutes.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Subscribers
                </span>
                <span className="font-bold text-gray-900">{plan.subscribers.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Monthly Revenue
                </span>
                <span className="font-bold text-gray-900">ETB {plan.revenue.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-2 border-green-100 bg-white/80 backdrop-blur">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-100">
          <CardTitle className="text-gray-900">Subscription Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-gradient-to-br from-red-50 to-red-100/50 rounded-lg border border-red-200">
              <p className="text-sm text-red-600 font-semibold">Total Subscribers</p>
              <p className="text-2xl font-bold text-red-700 mt-2">
                {plans.reduce((sum, p) => sum + p.subscribers, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-600 font-semibold">Total Revenue</p>
              <p className="text-2xl font-bold text-yellow-700 mt-2">
                ETB {plans.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg border border-green-200">
              <p className="text-sm text-green-600 font-semibold">Average Price</p>
              <p className="text-2xl font-bold text-green-700 mt-2">
                ETB {(plans.reduce((sum, p) => sum + p.price, 0) / plans.length).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
