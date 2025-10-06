"use client"

import { motion } from "framer-motion"
import ProductCard from "@/components/ProductCard"
import { ShopifyProduct } from "@/lib/shopify"

interface ProductGridProps {
  products: ShopifyProduct[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  // Helper function to format price
  const formatPrice = (amount: string, currencyCode: string) => {
    const price = parseFloat(amount)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, index) => {
        const image = product.images.edges[0]?.node.url || '/images/house.png'
        const price = formatPrice(
          product.priceRange.minVariantPrice.amount,
          product.priceRange.minVariantPrice.currencyCode
        )

        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ProductCard
              variant="grid"
              image={image}
              title={product.title}
              price={price}
              handle={product.handle}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
