import { ProductCard } from "@/components/products"
import { getProductsByHandle } from "@/lib/shopify"
import { notFound } from "next/navigation"

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProductsByHandle(params.handle)

  if (!product) {
    notFound()
  }

  const price = `$${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}`
  // Convert Shopify images format to simple array for ProductCard
  const images = product.images.edges.map(edge => ({ url: edge.node.url }))

  return (
    <main className="min-h-screen py-10 px-4 md:px-20 lg:px-40 flex items-center justify-center">
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">
        {/* Left side - Product details */}
        <div className="flex flex-col justify-center gap-5 text-center md:text-left max-w-md ">
          <h1 className="text-4xl md:text-5xl font-bold">{product.title}</h1>
          <p className="text-xl font-bold text-primary/80">{price}</p>
          <p className="text-muted-foreground text-md">
            {product.description}
          </p>
        </div>

        {/* Right side - Hero card */}
        <div className="flex flex-col justify-center items-center">
          <ProductCard
            images={images}
            title={product.title}
            variant="detail"
          />
        </div>
      </div>
    </main>
  )
}
