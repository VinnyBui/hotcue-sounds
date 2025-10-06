import { getProducts, ShopifyProduct } from "@/lib/shopify"
import ProductDisplayClient from "@/components/ProductDisplayClient"

export default async function ProductDisplaySection() {
  let products: ShopifyProduct[] = []

  try {
    products = await getProducts(10) // Get initial products
  } catch (err) {
    console.error("Failed to fetch products:", err)
    products = []
  }

  return (
    <section className="py-20 px-4 md:px-20 lg:px-40">
      <ProductDisplayClient initialProducts={products} />
    </section>
  )
}
