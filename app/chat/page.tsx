import { Layout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Chat } from "@/components/chat"

export default function ChatPage() {
  return (
    <Layout>
      <div className="container py-8 md:py-12 lg:py-24 bg-[#E0FFF5] min-h-screen">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h1 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl text-[#038E7D]">
            Customer Support
          </h1>
          <p className="max-w-[85%] leading-normal text-[#025E52] sm:text-lg sm:leading-7">
            Get in touch with our support team
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-md">
          <Card className="border-[#038E7D]/10 bg-white/80">
            <CardHeader>
              <CardTitle className="text-[#038E7D]">Chat with Support</CardTitle>
            </CardHeader>
            <CardContent>
              <Chat />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
