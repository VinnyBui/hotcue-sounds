import { getProductsByHandle } from "@/lib/shopify"
import { notFound } from "next/navigation"
import ProductDetailClient from "./ProductDetailClient"

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProductsByHandle(params.handle)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
