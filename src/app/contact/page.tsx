import { Mail, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata = {
  title: "Support - HotCue Sounds",
  description: "Get in touch with us or find answers to frequently asked questions.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen py-12 px-4 md:px-20 lg:px-40">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Support Hub</h1>
          <p className="text-muted-foreground text-lg">
            Have questions? We're here to help!
          </p>
        </div>

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-20">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-2xl md:text-4xl">
                <CardTitle>Contact Us</CardTitle>
              </div>
              <CardDescription>
                Get in touch with our team for support, inquiries, or feedback.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <a
                  href="mailto:support@hotcuesounds.com"
                  className="text-primary hover:underline"
                >
                  support@hotcuesounds.com
                </a>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Business Hours</h3>
                <p className="text-muted-foreground">
                  Monday - Friday: 9:00 AM - 5:00 PM PST<br />
                  Weekend: Closed
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Response Time</h3>
                <p className="text-muted-foreground">
                  We typically respond within 24-48 hours during business days.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="scroll-mt-20">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2  text-2xl md:text-4xl">
                <CardTitle>Frequently Asked Questions</CardTitle>
              </div>
              <CardDescription>
                Quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What formats are the sound packs in?</AccordionTrigger>
                  <AccordionContent>
                    All our sound packs are delivered in high-quality WAV format.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I download my purchase?</AccordionTrigger>
                  <AccordionContent>
                    After completing your purchase, you'll receive an email with download links.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Can I use these sounds commercially?</AccordionTrigger>
                  <AccordionContent>
                    Yes! All our sound packs come with a royalty-free license for commercial use in DJ sets, productions, and performances.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>What is your refund policy?</AccordionTrigger>
                  <AccordionContent>
                    Due to the digital nature of our products, we don't offer refunds.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>Do you offer custom sound design?</AccordionTrigger>
                  <AccordionContent>
                    Yes! We offer custom sound design services. Please contact us at support@hotcuesounds.com with your project details and we'll provide a quote.
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
