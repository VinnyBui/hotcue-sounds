import { getProductsByHandle } from "@/lib/shopify"
import { notFound } from "next/navigation"
import ProductDetailClient from "./ProductDetailClient"

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const product = await getProductsByHandle(handle)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
