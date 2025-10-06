"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import CategoryFilterButtons, { Category } from "@/components/CategoryFilterButtons"
import HorizontalProductScroll from "@/components/HorizontalProductScroll"
import { ShopifyProduct } from "@/lib/shopify"

interface ProductDisplayClientProps {
  initialProducts: ShopifyProduct[]
}

const categories: Category[] = [
  { label: "All", handle: null },
  { label: "House", handle: "house" },
  { label: "Techno", handle: "techno" },
  { label: "Bass", handle: "bass" },
  { label: "Breaks", handle: "breaks" },
  { label: "FX", handle: "fx" },
]

export default function ProductDisplayClient({ initialProducts }: ProductDisplayClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [products, setProducts] = useState<ShopifyProduct[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)

  const handleCategoryChange = async (handle: string | null) => {
    setActiveCategory(handle)
    setIsLoading(true)

    try {
      // Fetch products based on category
      const endpoint = handle
        ? `/api/products?collection=${handle}`
        : `/api/products`

      const response = await fetch(endpoint)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("Failed to fetch products:", error)
      // Fallback to initial products on error
      setProducts(initialProducts)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Category Filter Buttons */}
      <CategoryFilterButtons
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Split Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
        {/* Left Side - Text Content (1/3) */}
        <div className="lg:col-span-1 text-center lg:text-left space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Essential For<br />Mixing
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto lg:mx-0">
            Unique sounds packed with character and vibe, designed to elevate your music production.
          </p>
          <Link href="/products">
            <Button size="lg" className="px-8 py-6 text-base">
              SHOP ALL SOUNDS
            </Button>
          </Link>
        </div>

        {/* Right Side - Horizontal Scrolling Products (2/3) */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            <HorizontalProductScroll products={products} />
          )}
        </div>
      </div>
    </div>
  )
}
