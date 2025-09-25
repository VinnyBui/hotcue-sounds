import {Card, CardContent, CardFooter} from '@/components/ui/card'

interface ProductCardProps {
  image: string
  title: string
}

export default function ProductCard({ image, title }: ProductCardProps) {
  return (
    <Card className="flex-shrink-0 p-0 w-[250px] h-[250px] bg-transparent">
      <CardContent className="p-0 h-full">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </CardContent>
      <CardFooter className="pl-4 text-white font-semibold">
        {title}
      </CardFooter>
    </Card>
  )
}