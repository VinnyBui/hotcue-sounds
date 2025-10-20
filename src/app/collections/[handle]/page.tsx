import { getProductsByCollection, ShopifyProduct } from "@/lib/shopify"
import { ProductGrid } from "@/components/products"

interface CollectionPageProps {
  params: {
    handle: string
  }
}

// Map collection handles to display names
const collectionNames: Record<string, string> = {
  house: "House",
  techno: "Techno",
  bass: "Bass",
  breaks: "Breaks",
  fx: "FX"
}

const collectionDescriptions: Record<string, string> = {
  house: "House music samples and loops",
  techno: "Techno drums, loops, and FX",
  bass: "Bass House and Drum & Bass sounds",
  breaks: "Breakbeat, drum breaks, and percussion",
  fx: "Sound effects, risers, impacts, and transitions"
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle } = await params

  let products: ShopifyProduct[] = []
  let error: string | null = null

  try {
    products = await getProductsByCollection(handle, 50)
  } catch (err) {
    console.error(`Failed to fetch products for collection ${handle}:`, err)
    error = "Unable to load products at this time."
  }

  const collectionName = collectionNames[handle] || handle.charAt(0).toUpperCase() + handle.slice(1)
  const collectionDescription = collectionDescriptions[handle] || `Browse ${collectionName} products`

  return (
    <main className="min-h-screen py-20 px-4 md:px-20 lg:px-40">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{collectionName}</h1>
          <p className="text-muted-foreground text-lg">
            {collectionDescription}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">{error}</p>
          </div>
        )}

        {/* Products Grid */}
        {!error && products.length > 0 && (
          <ProductGrid products={products} />
        )}

        {/* Empty State */}
        {!error && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No products found in this collection yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
