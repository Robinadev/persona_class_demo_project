import { Layout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Mail, Phone } from 'lucide-react'

const faqs = [
  { question: "How do I make an international call?", answer: "To make an international call, dial the country code followed by the phone number. For Ethiopia, the country code is +251." },
  { question: "How can I top up my account?", answer: "You can top up your account through our website or mobile app using various payment methods including credit card, PayPal, or bank transfer." },
  { question: "What should I do if my call doesn't connect?", answer: "If your call doesn't connect, please check your account balance and ensure you've dialed the correct number including the country code. If the issue persists, please contact our support team." },
]

export default function SupportPage() {
  return (
    <Layout>
      <div className="container py-8 md:py-12 lg:py-24">
        <h1 className="text-3xl font-bold text-center text-[#038E7D] mb-8">Help & Support</h1>
        
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Card className="border-[#038E7D]/10 bg-[#F0FFF9]">
            <CardHeader>
              <CardTitle className="text-[#038E7D] flex items-center">
                <Mail className="mr-2" /> Email Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#025E52] mb-4">
                For non-urgent inquiries, please email us. We'll respond within 24 hours.
              </p>
              <Button 
                className="w-full bg-[#038E7D] hover:bg-[#025E52] text-white"
                onClick={() => window.location.href = 'mailto:support@talari.com'}
              >
                Email Us
              </Button>
            </CardContent>
          </Card>

          <Card className="border-[#038E7D]/10 bg-[#F0FFF9]">
            <CardHeader>
              <CardTitle className="text-[#038E7D] flex items-center">
                <Phone className="mr-2" /> Calling Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#025E52] mb-4">
                For immediate assistance, our support team is available 24/7.
              </p>
              <Button 
                className="w-full bg-[#038E7D] hover:bg-[#025E52] text-white"
                onClick={() => window.location.href = 'tel:+18001234567'}
              >
                Call Us
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#038E7D]/10 bg-[#F0FFF9]">
          <CardHeader>
            <CardTitle className="text-[#038E7D]">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-[#038E7D]">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-[#025E52]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
