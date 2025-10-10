"use client"
import { motion, AnimatePresence } from "framer-motion"
import { ProductCard } from "@/components/products"
import { ShopifyProduct } from "@/lib/shopify"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface HeroClientProps {
  products: ShopifyProduct[]
}

export default function HeroClient({ products }: HeroClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1))
  }

  return (
    <section className="h-[90vh] flex items-center justify-center overflow-x-hidden md:px-20">
      {/* Mobile Carousel View */}
      <div className="md:hidden relative w-full flex items-center justify-center">
        {/* Left Arrow */}
        <button
          onClick={handlePrevious}
          className={`absolute left-2 z-10 p-2 rounded-full bg-background/80 border border-border hover:bg-accent transition-all duration-300 ${
            showLeftArrow ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Previous product"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Product Card Carousel with Hover Area */}
        <div
          className="w-full flex justify-center"
          onMouseEnter={() => {
            setShowLeftArrow(true)
            setShowRightArrow(true)
          }}
          onMouseLeave={() => {
            setShowLeftArrow(false)
            setShowRightArrow(false)
          }}
        >
          <AnimatePresence mode="wait">
            {products.map((product, i) => {
              if (i !== currentIndex) return null

              const images = product.images.edges.map(edge => ({ url: edge.node.url }))

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="w-[350px] h-[350px]"
                >
                  <ProductCard variant="hero" images={images} title={product.title} handle={product.handle} />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className={`absolute right-2 z-10 p-2 rounded-full bg-background/80 border border-border hover:bg-accent transition-all duration-300 ${
            showRightArrow ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Next product"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop View (Original 3D perspective grid) */}
      <div className="hidden md:flex gap-25 flex-row">
        {products.map((product, i) => {
          const translateY = 0 - i * 10

          // Convert Shopify images format to simple array for ProductCard
          const images = product.images.edges.map(edge => ({ url: edge.node.url }))

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
              <ProductCard variant="hero" images={images} title={product.title} handle={product.handle} />
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
