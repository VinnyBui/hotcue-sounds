"use client"

import { motion } from "framer-motion"
import { Award, Shield, Zap, Infinity, HeadphonesIcon, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Award,
    title: "Professional Quality",
    description: "Studio-grade 24-bit WAV files, expertly mixed and mastered for your productions.",
  },
  {
    icon: Shield,
    title: "100% Royalty-Free",
    description: "Use in unlimited commercial projects without attribution or additional fees.",
  },
  {
    icon: Zap,
    title: "DAW Compatible",
    description: "Works seamlessly with Ableton, FL Studio, Logic Pro, Pro Tools, and all major DAWs.",
  },
  {
    icon: Infinity,
    title: "Instant Access",
    description: "Download immediately after purchase. No waiting, no delays—start creating right away.",
  },
  {
    icon: Sparkles,
    title: "Lifetime License",
    description: "Buy once, use forever. Free updates included on all purchased packs.",
  },
  {
    icon: HeadphonesIcon,
    title: "Premium Support",
    description: "Get help whenever you need it. Our team is here to ensure your success.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 md:px-20 lg:px-40 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Hotcue Sounds
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Professional-grade sounds with unbeatable value and support
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-background hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-7 h-7 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
