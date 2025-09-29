import {Card, CardContent, CardFooter} from '@/components/ui/card'

interface ProductCardProps {
  image: string
  title: string
}

export default function ProductCard({ image, title }: ProductCardProps) {
  return (
    <Card className="flex-shrink-0 p-0 max-w-[125px] max-h-[125px] md:max-w-[250px] md:max-h-[250px] bg-transparent border-0">
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