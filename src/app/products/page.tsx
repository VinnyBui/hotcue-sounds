import { getProducts } from "@/lib/shopify"
import ProductGrid from "@/components/ProductGrid"

export default async function ProductsPage() {
  const products = await getProducts(50) // Get up to 50 products

  return (
    <main className="min-h-screen py-20 px-4 md:px-20 lg:px-40">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Products</h1>
          <p className="text-muted-foreground text-lg">
            Browse our complete collection of professional sound packs
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No products found. Check back soon!
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
