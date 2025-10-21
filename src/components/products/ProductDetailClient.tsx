"use client"

import { motion } from "framer-motion"
import { ProductCard, AudioDrawer } from "@/components/products"
import { ShopifyProduct } from "@/lib/shopify"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cartStore"
import { useState } from "react"

interface ProductDetailClientProps {
  product: ShopifyProduct
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const price = `$${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}`
  const images = product.images.edges.map(edge => ({ url: edge.node.url }))

  const addItem = useCartStore(state => state.addItem)
  const isLoading = useCartStore(state => state.isLoading)
  const [justAdded, setJustAdded] = useState(false)

  const handleAddToCart = async () => {
    try {
      // Get the first variant (default variant)
      const variantId = product.variants.edges[0].node.id

      // Add to cart
      await addItem(variantId, 1)

      // Show success feedback
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 2000)

      console.log('✅ Added to cart:', product.title)
    } catch (error) {
      console.error('❌ Failed to add to cart:', error)
      alert('Failed to add to cart. Please try again.')
    }
  }

  return (
    <main className="min-h-screen py-10 px-4 md:px-20 lg:px-40 flex items-center justify-center">
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">
        {/* Left side - Product details */}
        <motion.div
          className="flex flex-col justify-center gap-5 text-center md:text-left max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl font-bold">{product.title}</h1>
          <p className="text-xl font-bold text-primary/80">{price}</p>
          <p className="text-muted-foreground text-md">
            {product.description}
          </p>
          <div className="flex gap-5 justify-center md:justify-start">
            {product.audioPreviewUrl && (
              <div className="flex justify-center md:justify-start">
                <AudioDrawer
                  audioUrl={product.audioPreviewUrl}
                  productTitle={product.title}
                  variant="detail"
                  size="lg"
                />
              </div>
            )}
            <Button
              className="px-4 py-6 text-base"
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : justAdded ? 'Added!' : 'Add to Cart'}
            </Button>
          </div>
        </motion.div>

        {/* Right side - Spinning record */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{
            opacity: 1,
            x: 0,
            rotate: 360
          }}
          transition={{
            opacity: { duration: 0.6, delay: 0.2, ease: "easeOut" },
            x: { duration: 0.6, delay: 0.2, ease: "easeOut" },
            rotate: {
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        >
          <ProductCard
            images={images}
            title={product.title}
            variant="detail"
          />
        </motion.div>
      </div>
    </main>
  )
}
