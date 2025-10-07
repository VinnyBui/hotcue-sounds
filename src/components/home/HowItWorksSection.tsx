"use client"

import { motion } from "framer-motion"
import { Search, ShoppingCart, Download, Headphones } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const steps = [
  {
    icon: Search,
    title: "Browse & Preview",
    description: "Explore our curated collection of professional sound packs and preview samples before purchasing.",
  },
  {
    icon: ShoppingCart,
    title: "Purchase",
    description: "Secure checkout with instant confirmation. All purchases are protected and encrypted.",
  },
  {
    icon: Download,
    title: "Download",
    description: "Get immediate access to your files in high-quality WAV and MP3 formats.",
  },
  {
    icon: Headphones,
    title: "Create",
    description: "Import into your DAW and start making music. 100% royalty-free for your productions.",
  },
]

const features = [
  "Royalty-Free License",
  "Instant Download",
  "High-Quality WAV/MP3",
  "Compatible with All DAWs",
]

export default function HowItWorksSection() {
  return (
    <section className="py-20 px-4 md:px-20 lg:px-40">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get professional sounds for your music production in minutes
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-2 hover:border-primary transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-primary mb-2">
                    Step {index + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-4 rounded-lg bg-muted/50 flex justify-center items-center"
            >
              <p className="font-semibold text-sm md:text-base">{feature}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
