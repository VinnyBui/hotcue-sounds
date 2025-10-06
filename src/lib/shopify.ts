export async function shopifyFetch(
  query: string,
  variables: Record<string, any> = {}
) {
  const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
      },
      body: JSON.stringify({ query, variables }),
      // ensures fresh data in dev (disable caching)
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      throw new Error(`Shopify API error: ${res.status} ${res.statusText}`)
    }

    const json = await res.json()

    if (json.errors) {
      console.error("Shopify GraphQL errors:", json.errors)
      throw new Error(`Shopify GraphQL errors: ${JSON.stringify(json.errors)}`)
    }

    return json.data
  } catch (error) {
    console.error("Shopify fetch failed:", error)
    throw error
  }
}

export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  description: string
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  images: {
    edges: Array<{
      node: {
        url: string
        altText: string | null
      }
    }>
  }
}

export async function getProducts(limit: number = 10): Promise<ShopifyProduct[]> {
  const query = `
    query GetProducts($limit: Int!) {
      products(first: $limit) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 2) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `

  const data = await shopifyFetch(query, { limit })
  return data.products.edges.map((edge: any) => edge.node)
}

export async function getProductsByCollection(
  collectionHandle: string,
  limit: number = 10
): Promise<ShopifyProduct[]> {
  const query = `
    query GetCollectionProducts($handle: String!, $limit: Int!) {
      collectionByHandle(handle: $handle) {
        products(first: $limit) {
          edges {
            node {
              id
              title
              handle
              description
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 2) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const data = await shopifyFetch(query, { handle: collectionHandle, limit })

  // Handle case where collection doesn't exist
  if (!data.collectionByHandle) {
    return []
  }

  return data.collectionByHandle.products.edges.map((edge: any) => edge.node)
}
