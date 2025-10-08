"use client"

import {Card, CardContent, CardFooter} from '@/components/ui/card'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import AudioDrawer from './AudioDrawer'

interface ProductCardProps {
  image?: string
  images?: Array<{ url: string }>
  title: string
  price?: string
  handle?: string
  variant?: 'hero' | 'grid' | 'detail'
  audioPreviewUrl?: string
}

export default function ProductCard({
  image,
  images,
  title,
  price,
  handle,
  variant = 'hero',
  audioPreviewUrl
}: ProductCardProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering theme-dependent content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine which image to use based on theme
  let displayImage: string

  if (images && images.length > 0) {
    // If images array is provided, use theme-aware selection
    const darkImage = images[0]?.url || '/images/soundpacks.png'
    const lightImage = images[1]?.url || darkImage // Fallback to first image if no second image

    // Use first image during SSR, then switch based on theme after mount
    displayImage = !mounted ? darkImage : (theme === 'dark' ? darkImage : lightImage)
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
        <CardContent className="p-0 h-full">
          <img
            src={displayImage}
            alt={title}
            className="w-full h-full object-cover rounded-full"
          />
        </CardContent>
      </Card>
    )
  }

  // Hero variant (used in HeroSection with 3D perspective)
  if (variant === 'hero') {
    return (
      <Card className="flex-shrink-0 p-0 max-w-[125px] max-h-[125px] md:max-w-[250px] md:max-h-[250px] bg-transparent border-2 border-border rounded-full ">
        <CardContent className="p-0 h-full">
          <img
            src={displayImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </CardContent>
        <CardFooter className="p-0 font-semibold text-xs md:text-lg flex justify-center">
          {title}
        </CardFooter>
      </Card>
    )
  }

  // Grid variant (used in ProductDisplaySection with links and prices)
  const cardContent = (
    <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 ">
      <CardContent className="p-0 relative">
        <div className="aspect-square overflow-hidden">
          <img
            src={displayImage}
            alt={title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
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
      <CardFooter className="flex flex-col items-start p-4 gap-2">
        <h3 className="font-semibold text-base md:text-lg line-clamp-2">
          {title}
        </h3>
        {price && (
          <p className="text-primary font-bold text-lg">
            {price}
          </p>
        )}
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