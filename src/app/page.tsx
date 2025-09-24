import { shopifyFetch } from "../lib/shopify"

export default async function HomePage() {
  const query = `
    {
      products(first: 1) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `

  const data = await shopifyFetch(query)
  const firstProduct = data.products.edges[0]?.node?.title || "No products found"

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-4">HotCue Sounds</h1>
      <p>First product: {firstProduct}</p>
    </main>
  )
}
