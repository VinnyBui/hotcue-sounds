"use client"
import { motion } from "framer-motion"
import { ProductCard } from "@/components/products"
import { ShopifyProduct } from "@/lib/shopify"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

interface HeroClientProps {
  products: ShopifyProduct[]
}

export default function HeroClient({ products }: HeroClientProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering theme-dependent content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="h-[90vh] flex items-center justify-center overflow-x-hidden md:px-20">
      <div className="flex gap-25 flex-col md:flex-row">
        {products.map((product, i) => {
          const translateY = 0 - i * 10

          // Get the appropriate image based on theme
          // First image (index 0) for dark mode, second image (index 1) for light mode
          const darkImage = product.images.edges[0]?.node.url || '/images/soundpacks.png'
          const lightImage = product.images.edges[1]?.node.url || darkImage // Fallback to first image if no second image

          // Use first image during SSR, then switch based on theme after mount
          const image = !mounted ? darkImage : (theme === 'dark' ? darkImage : lightImage)

          return (
            <motion.div
              key={product.id}
              className={
                i === 3
                  ? "hidden lg:block"
                  : "" 
              }
              initial={{
                opacity: 0,
                transform: `perspective(1000px) rotateY(-30deg) translateY(${translateY}px)`,
              }}
              animate={{
                opacity: 1,
                transform: `perspective(1000px) rotateY(-30deg) translateY(${translateY}px)`,
                transition: { duration: 0.5, delay: i * 0.3, ease: "easeOut" },
              }}
              whileHover={{
                transform: `perspective(1000px) rotateY(-15deg) translateY(${translateY}px)`,
                transition: { duration: 0.2, ease: "easeOut" },
              }}
            >
              <ProductCard variant="hero" image={image} title={product.title} handle={product.handle} />
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
