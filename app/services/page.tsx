import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  { title: "International Calling", description: "Make affordable calls to Ethiopia and beyond." },
  { title: "Mobile Top-Up", description: "Recharge mobile credits for your loved ones." },
  { title: "Money Transfer", description: "Send money securely to Ethiopia." },
]

export default function ServicesPage() {
  return (
    <Layout>
      <div className="container py-8 md:py-12 lg:py-24">
        <h1 className="text-3xl font-bold text-center text-[#038E7D] mb-8">Our Services</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service, index) => (
            <Card key={index} className="border-[#038E7D]/10 bg-[#F0FFF9]">
              <CardHeader>
                <CardTitle className="text-[#038E7D]">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#025E52]">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}
