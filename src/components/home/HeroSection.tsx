import { getProductsByCollection, ShopifyProduct } from "@/lib/shopify"
import HeroClient from "./HeroClient"

export default async function HeroSection() {
  let products: ShopifyProduct[] = []

  try {
    products = await getProductsByCollection("featured", 4)
  } catch (err) {
    console.error("Failed to fetch featured products:", err)
    products = []
  }

  return <HeroClient products={products} />
}
