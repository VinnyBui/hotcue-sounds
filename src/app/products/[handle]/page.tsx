import { getProductsByHandle } from "@/lib/shopify"
import { notFound } from "next/navigation"
import ProductDetailClient from "./ProductDetailClient"
import { Metadata } from "next"

interface ProductPageProps {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params
  const product = await getProductsByHandle(handle)

  if (!product) {
    return {
      title: "Product Not Found - HotCue Sounds",
      description: "The product you're looking for doesn't exist.",
    }
  }

  const price = `$${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}`

  return {
    title: `${product.title} - HotCue Sounds`,
    description: product.description || `${product.title} - ${price}. Premium sound pack for DJs.`,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params
  const product = await getProductsByHandle(handle)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
