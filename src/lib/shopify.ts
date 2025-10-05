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
