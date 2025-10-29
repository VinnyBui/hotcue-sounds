"use client"

import Image from 'next/image'
import {Card, CardContent, CardFooter} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { ShoppingCart } from 'lucide-react'
import AudioDrawer from './AudioDrawer'
import { useCartStore } from '@/store/cartStore'

interface ProductCardProps {
  image?: string
  images?: Array<{ url: string }>
  title: string
  price?: string
  handle?: string
  variant?: 'hero' | 'grid' | 'detail'
  audioPreviewUrl?: string
  variantId?: string
}

export default function ProductCard({
  image,
  images,
  title,
  price,
  handle,
  variant = 'hero',
  audioPreviewUrl,
  variantId
}: ProductCardProps) {
  const { theme, resolvedTheme } = useTheme()
  const { addItem } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Prevent hydration mismatch by only rendering theme-dependent content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking button inside Link
    e.stopPropagation()

    if (!variantId) {
      alert("Unable to add to cart: No variant available")
      return
    }

    setIsAdding(true)
    try {
      await addItem(variantId, 1)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error("Failed to add to cart:", error)
      alert("Failed to add to cart. Please try again.")
    } finally {
      setIsAdding(false)
    }
  }

  // Determine which image to use based on theme
  let displayImage: string

  if (images && images.length > 0) {
    // If images array is provided, use theme-aware selection
    const lightImage = images[0]?.url || '/images/soundpacks.png'
    const darkImage = images[1]?.url || lightImage // Fallback to first image if no second image

    // Use resolvedTheme to handle 'system' theme properly
    const currentTheme = mounted ? (resolvedTheme || theme) : 'light'
    const isDark = currentTheme === 'dark'

    displayImage = isDark ? darkImage : lightImage
  } else if (image) {
    // Backwards compatibility: use single image if provided
    displayImage = image
  } else {
    // Fallback if neither is provided
    displayImage = '/images/soundpacks.png'
  }
  // Detail variant (used in product detail page - circular without footer)
  if (variant === 'detail') {
    return (
      <Card className="flex-shrink-0 p-0 max-w-[250px] max-h-[250px] md:max-w-[350px] md:max-h-[350px] bg-transparent border-2 border-border rounded-full">
        <CardContent className="p-0 h-full relative">
          <Image
            src={displayImage}
            alt={title}
            fill
            className="object-cover rounded-full"
          />
        </CardContent>
      </Card>
    )
  }

  // Hero variant (used in HeroSection with 3D perspective)
  if (variant === 'hero') {
    return (
      <Card className="flex-shrink-0 p-0 w-full h-full md:max-w-[250px] md:max-h-[250px] bg-transparent border-2 border-border rounded-full ">
        <CardContent className="p-0 h-full relative">
          <Image
            src={displayImage}
            alt={title}
            fill
            className="object-cover rounded-full"
          />
        </CardContent>
        <CardFooter className="p-0 font-semibold text-sm md:text-lg flex justify-center">
          {title}
        </CardFooter>
      </Card>
    )
  }

  // Grid variant (used in ProductDisplaySection with links and prices)
  const cardContent = (
    <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 ">
      <CardContent className="p-0 relative">
        <div className="aspect-square overflow-hidden relative">
          <Image
            src={displayImage}
            alt={title}
            fill
            className="object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
        {audioPreviewUrl && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
            <AudioDrawer
              audioUrl={audioPreviewUrl}
              productTitle={title}
              variant="grid"
              size="md"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4 gap-3">
        <h3 className="font-semibold text-base md:text-lg line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center justify-between w-full">
          {price && (
            <p className="text-primary font-bold text-lg">
              {price}
            </p>
          )}
          {variantId && (
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isAdding || showSuccess}
              className="ml-auto"
            >
              {showSuccess ? (
                <>Added!</>
              ) : isAdding ? (
                <>Adding...</>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )

  // Wrap in Link if handle is provided
  if (handle) {
    return (
      <Link href={`/products/${handle}`}>
        {cardContent}
      </Link>
    )
  }

  return cardContent
}