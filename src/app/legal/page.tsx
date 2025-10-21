import { Scale, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Legal - HotCue Sounds",
  description: "Terms of Service and Privacy Policy for HotCue Sounds.",
}

export default function LegalPage() {
  return (
    <main className="min-h-screen py-12 px-4 md:px-20 lg:px-40">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Legal</h1>
          <p className="text-muted-foreground text-lg">
            Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Terms of Service Section */}
        <section id="terms" className="scroll-mt-20">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 tex-2xl md:text-4xl">
                <CardTitle>Terms of Service</CardTitle>
              </div>
              <CardDescription>
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Acceptance of Terms</h3>
                <p>
                  By accessing and using HotCue Sounds, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Use License</h3>
                <p>
                  Permission is granted to download one copy of the materials (sound packs) on HotCue Sounds for personal or commercial use.
                  This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Redistribute or resell the sound packs</li>
                  <li>Share download links with others</li>
                  <li>Claim the sounds as your own original work</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Commercial Use</h3>
                <p>
                  All sound packs purchased from HotCue Sounds include a royalty-free license for commercial use in DJ performances,
                  music productions, and related creative projects.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">4. Refunds and Returns</h3>
                <p>
                  Due to the digital nature of our products, all sales are final. We do not offer refunds except in cases of
                  technical issues preventing download or use of the product.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">5. Disclaimer</h3>
                <p>
                  The materials on HotCue Sounds are provided on an 'as is' basis. HotCue Sounds makes no warranties,
                  expressed or implied, and hereby disclaims and negates all other warranties including, without limitation,
                  implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement
                  of intellectual property or other violation of rights.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">6. Limitations</h3>
                <p>
                  In no event shall HotCue Sounds or its suppliers be liable for any damages (including, without limitation,
                  damages for loss of data or profit, or due to business interruption) arising out of the use or inability to
                  use the materials on HotCue Sounds.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">7. Modifications</h3>
                <p>
                  HotCue Sounds may revise these terms of service at any time without notice. By using this website you are
                  agreeing to be bound by the then current version of these terms of service.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Privacy Policy Section */}
        <section id="privacy" className="scroll-mt-20">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-2xl md:text-4xl">
                <CardTitle>Privacy Policy</CardTitle>
              </div>
              <CardDescription>
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Information We Collect</h3>
                <p>
                  We collect information you provide directly to us when you:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Create an account</li>
                  <li>Make a purchase</li>
                  <li>Contact us for support</li>
                  <li>Subscribe to our newsletter</li>
                </ul>
                <p className="mt-2">
                  This may include your name, email address, payment information, and purchase history.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">2. How We Use Your Information</h3>
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Process and fulfill your orders</li>
                  <li>Send you order confirmations and download links</li>
                  <li>Respond to your questions and provide customer support</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Improve our products and services</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Information Sharing</h3>
                <p>
                  We do not sell, trade, or rent your personal information to third parties. We may share your information with:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Payment processors to handle transactions (Shopify)</li>
                  <li>Email service providers to send communications</li>
                  <li>Analytics providers to understand how our site is used</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">4. Cookies and Tracking</h3>
                <p>
                  We use cookies and similar tracking technologies to track activity on our website and hold certain information.
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">5. Data Security</h3>
                <p>
                  We implement appropriate technical and organizational security measures to protect your personal information.
                  However, no method of transmission over the Internet or electronic storage is 100% secure.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">6. Your Rights</h3>
                <p>You have the right to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">7. Contact Us</h3>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:support@hotcuesounds.com" className="text-primary hover:underline">
                    support@hotcuesounds.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
