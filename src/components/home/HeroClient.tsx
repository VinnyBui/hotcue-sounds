"use client"
import { motion } from "framer-motion"
import { ProductCard } from "@/components/products"
import { ShopifyProduct } from "@/lib/shopify"

interface HeroClientProps {
  products: ShopifyProduct[]
}

export default function HeroClient({ products }: HeroClientProps) {
  return (
    <section className="h-[90vh] flex items-center justify-center overflow-x-hidden md:px-20">
      <div className="flex gap-25 flex-col md:flex-row">
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
