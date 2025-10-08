"use client"

import { motion } from "framer-motion"
import ProductCard from "@/components/products/ProductCard"
import { ShopifyProduct } from "@/lib/shopify"
import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface HorizontalProductScrollProps {
  products: ShopifyProduct[]
}

export default function HorizontalProductScroll({ products }: HorizontalProductScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Helper function to format price
  const formatPrice = (amount: string, currencyCode: string) => {
    const price = parseFloat(amount)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth / 2
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <p className="text-muted-foreground">No products in this category yet.</p>
      </div>
    )
  }

  return (
    <div className="relative group">
      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
        style={{
          scrollSnapType: 'x mandatory',
        }}
      >
        {products.map((product, index) => {
          // Convert Shopify images format to simple array for ProductCard
          const images = product.images.edges.map(edge => ({ url: edge.node.url }))

          const price = formatPrice(
            product.priceRange.minVariantPrice.amount,
            product.priceRange.minVariantPrice.currencyCode
          )

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex-shrink-0 w-[280px] md:w-[320px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <ProductCard
                variant="grid"
                images={images}
                title={product.title}
                price={price}
                handle={product.handle}
              />
            </motion.div>
          )
        })}
      </div>

      {/* Scroll Buttons - Only show if more than 2 products */}
      {products.length > 2 && (
        <>
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-background border-2 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-background border-2 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  )
}
