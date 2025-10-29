import { Music, Headphones, Zap, Target } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "About Us - HotCue Sounds",
  description: "Learn about HotCue Sounds - your source for premium DJ sound packs, hot cues, and electronic music samples.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen py-12 px-4 md:px-20 lg:px-40">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">About HotCue Sounds</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Elevating DJ performances with premium sound packs, hot cues, and samples crafted for the modern electronic music producer.
          </p>
        </div>

        {/* Mission Statement */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                At HotCue Sounds, we believe every DJ and producer deserves access to high-quality,
                professional-grade audio tools that can take their performances to the next level.
                Whether you&apos;re spinning at a club, producing in the studio, or streaming online,
                our curated collection of hot cues, sound effects, and samples gives you the creative
                edge you need.
              </p>
              <p>
                We&apos;re passionate about electronic music and understand the importance of having the
                right sounds at your fingertips. That&apos;s why every product in our catalog is carefully
                selected and tested to ensure it meets the high standards of professional DJs and producers worldwide.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* What We Offer */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-center">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Music className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Premium Hot Cues</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Genre-specific hot cues designed for seamless mixing. From house to techno,
                  bass to breaks, we&apos;ve got you covered with sounds that fit perfectly into your sets.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Headphones className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Sound Packs</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive collections of loops, one-shots, and samples.
                  Each pack is meticulously organized and ready to drop into your DAW or DJ software.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>DJ Effects</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  High-impact sound effects for transitions, buildups, and drops.
                  Add energy and excitement to your performances with professional FX.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Royalty-Free License</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Use all our sounds commercially in your DJ sets, productions, streams,
                  and performances. No attribution required, no hidden fees.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Why Choose Us */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Why Choose HotCue Sounds?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Professional Quality</h3>
                  <p className="text-muted-foreground">
                    Every sound is professionally mixed, mastered, and optimized for club systems and studio monitors.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Instant Download</h3>
                  <p className="text-muted-foreground">
                    Get immediate access to your purchases. Download high-quality WAV files directly to your computer.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Genre-Specific</h3>
                  <p className="text-muted-foreground">
                    Browse by genre to find exactly what fits your style - whether you&apos;re into house, techno, bass music, or breaks.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Always Fresh</h3>
                  <p className="text-muted-foreground">
                    Our catalog is constantly updated with new sounds to keep your sets sounding fresh and current.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center py-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-3">Ready to Elevate Your Sets?</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Explore our collection and discover the sounds that will take your DJ performances
                and productions to the next level.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Browse Sound Packs
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
