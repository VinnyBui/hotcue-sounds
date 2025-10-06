import {Card, CardContent, CardFooter} from '@/components/ui/card'
import Link from 'next/link'

interface ProductCardProps {
  image: string
  title: string
  price?: string
  handle?: string
  variant?: 'hero' | 'grid'
}

export default function ProductCard({
  image,
  title,
  price,
  handle,
  variant = 'hero'
}: ProductCardProps) {
  // Hero variant (used in HeroSection with 3D perspective)
  if (variant === 'hero') {
    return (
      <Card className="flex-shrink-0 p-0 max-w-[125px] max-h-[125px] md:max-w-[250px] md:max-h-[250px] bg-transparent border-2 border-border rounded-lg">
        <CardContent className="p-0 h-full">
          <img
            src={image}
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
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
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