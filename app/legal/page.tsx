import { Layout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const legalSections = [
  {
    title: "Terms of Service",
    content: "By using TalariTel's services, you agree to comply with and be bound by the following terms and conditions of use. Please review these terms carefully. If you do not agree to these terms, you should not use this service."
  },
  {
    title: "Privacy Policy",
    content: "TalariTel is committed to protecting your privacy. This Privacy Policy explains our data processing practices and your options regarding the ways in which your personal data is used."
  },
  {
    title: "Acceptable Use Policy",
    content: "The Acceptable Use Policy outlines the permitted uses and prohibited uses of TalariTel's services. By using our services, you agree not to use them for any unlawful purposes or in a way that could damage, disable, overburden, or impair our servers or networks."
  },
  {
    title: "Copyright Notice",
    content: "All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of TalariTel or its content suppliers and protected by international copyright laws."
  },
  {
    title: "Disclaimer of Warranties",
    content: "TalariTel's services are provided 'as is' without any representations or warranties, express or implied. TalariTel makes no representations or warranties in relation to this website or the information and materials provided on this website."
  },
  {
    title: "Limitation of Liability",
    content: "TalariTel will not be liable to you in relation to the contents of, or use of, or otherwise in connection with, this website for any indirect, special or consequential loss; or for any business losses, loss of revenue, income, profits or anticipated savings, loss of contracts or business relationships, loss of reputation or goodwill, or loss or corruption of information or data."
  }
]

export default function LegalPage() {
  return (
    <Layout>
      <div className="container py-8 md:py-12 lg:py-24">
        <h1 className="text-3xl font-bold text-center text-[#038E7D] mb-8">Legal and Terms & Conditions</h1>
        <Card className="border-[#038E7D]/10 bg-[#F0FFF9]">
          <CardHeader>
            <CardTitle className="text-[#038E7D]">Important Legal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {legalSections.map((section, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-[#038E7D]">{section.title}</AccordionTrigger>
                  <AccordionContent className="text-[#025E52]">
                    <p>{section.content}</p>
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
