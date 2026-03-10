'use client';

import { Layout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const faqs = [
  { question: "How do I make an international call?", answer: "To make an international call, dial the country code followed by the phone number. For Ethiopia, the country code is +251." },
  { question: "How can I top up my account?", answer: "You can top up your account through our website or mobile app using various payment methods including credit card, PayPal, or bank transfer." },
  { question: "What should I do if my call doesn't connect?", answer: "If your call doesn't connect, please check your account balance and ensure you've dialed the correct number including the country code. If the issue persists, please contact our support team." },
  { question: "How secure is my account?", answer: "We use industry-standard encryption to protect your account data. Two-factor authentication is available for added security." },
  { question: "Can I change my account type?", answer: "Yes, you can upgrade or downgrade your account type at any time from your settings. Some features may vary based on your account type." },
]

export default function SupportPage() {
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Implement message submission to backend
      toast.success('Message sent successfully! We will get back to you soon.')
      setMessage('')
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50">
        <div className="container py-8 md:py-12 lg:py-24">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 bg-clip-text text-transparent mb-3">
              Help & Support
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're here to help! Choose how you'd like to reach us.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <Card className="border-2 border-red-200 bg-white/80 backdrop-blur hover:shadow-lg transition-all">
              <CardHeader className="bg-gradient-to-r from-red-100 to-red-50">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center mb-3">
                  <Mail className="w-6 h-6" />
                </div>
                <CardTitle className="text-red-700">Email Support</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  For non-urgent inquiries, please email us. We'll respond within 24 hours.
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                  onClick={() => window.location.href = 'mailto:support@talaritel.com'}
                >
                  Email Us
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200 bg-white/80 backdrop-blur hover:shadow-lg transition-all">
              <CardHeader className="bg-gradient-to-r from-yellow-100 to-yellow-50">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 text-white flex items-center justify-center mb-3">
                  <Phone className="w-6 h-6" />
                </div>
                <CardTitle className="text-yellow-700">Call Center</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  For immediate assistance, our support team is available 24/7.
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white"
                  onClick={() => window.location.href = 'tel:+251911223344'}
                >
                  Call Support
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-white/80 backdrop-blur hover:shadow-lg transition-all">
              <CardHeader className="bg-gradient-to-r from-green-100 to-green-50">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center mb-3">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <CardTitle className="text-green-700">Live Chat</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Chat with us in real-time. Quick and convenient support.
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  onClick={() => toast.info('Live chat feature coming soon!')}
                >
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Send Message Form */}
          <Card className="border-2 border-primary/20 shadow-lg mb-12 bg-white/80 backdrop-blur">
            <CardHeader className="bg-gradient-to-r from-red-100 via-yellow-100 to-green-100">
              <CardTitle className="bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 bg-clip-text text-transparent">
                Send Us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmitMessage} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full px-3 py-2 border-2 border-muted-foreground/30 rounded-lg focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-3 py-2 border-2 border-muted-foreground/30 rounded-lg focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    className="w-full px-3 py-2 border-2 border-muted-foreground/30 rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <textarea
                    placeholder="Tell us more about your issue..."
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-muted-foreground/30 rounded-lg focus:outline-none focus:border-primary resize-none"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-white font-semibold h-11"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card className="border-2 border-primary/20 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader className="bg-gradient-to-r from-red-100 via-yellow-100 to-green-100">
              <CardTitle className="bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 bg-clip-text text-transparent">
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible>
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-foreground hover:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
