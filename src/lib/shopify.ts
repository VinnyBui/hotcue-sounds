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

export interface ShopifyProductVariant {
  id: string                    // "gid://shopify/ProductVariant/123"
  title: string                 // "Default Title" or "Large / Red"
  price: {
    amount: string              // "24.99"
    currencyCode: string        // "USD"
  }
  availableForSale: boolean     // true/false
  quantityAvailable?: number    // Stock level (optional)
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
  variants: {
  edges: Array<{
    node: ShopifyProductVariant
  }>
}
  audioPreviewUrl?: string
}

// ===== CART TYPES =====

export interface CartLineInput {
  merchandiseId: string  // ProductVariant ID
  quantity: number
  attributes?: Array<{ 
    key: string; 
    value: string 
  }>
}

export interface ShopifyCartLine {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    price: {
      amount: string
      currencyCode: string
    }
    product: {
      id: string
      title: string
      handle: string
      images: {
        edges: Array<{
          node: {
            url: string
            altText: string | null
          }
        }>
      }
    }
  }
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  lines: {
    edges: Array<{
      node: ShopifyCartLine
    }>
  }
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
    subtotalAmount: {
      amount: string
      currencyCode: string
    }
    totalTaxAmount?: {
      amount: string
      currencyCode: string
    }
  }
}

export interface CartUserError {
  field: string[]
  message: string
}

// ===== ORDER TYPES =====

export interface OrderLineItem {
  title: string
  quantity: number
  originalTotalPrice: {
    amount: string
    currencyCode: string
  }
  variant?: {
    id: string
    title: string
    image?: {
      url: string
      altText: string | null
    }
    product: {
      id: string
      handle: string
      title: string
      audioPreviewUrl?: string
    }
  }
}

export interface ShopifyOrder {
  id: string
  orderNumber: number
  processedAt: string
  financialStatus: string
  fulfillmentStatus: string
  totalPrice: {
    amount: string
    currencyCode: string
  }
  lineItems: {
    edges: Array<{
      node: OrderLineItem
    }>
  }
}

// ===== PRODUCT FUNCTIONS =====

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
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  quantityAvailable
                }
              }
            }
            previewAudio: metafield(namespace: "custom", key: "preview_audio_url") {
              reference {
                ... on GenericFile {
                  url
                }
              }
            }
          }
        }
      }
    }
  `

  const data = await shopifyFetch(query, { limit })
  return data.products.edges.map((edge: any) => ({
    ...edge.node,
    audioPreviewUrl: edge.node.previewAudio?.reference?.url
  }))
}

export async function getProductsByCollection(collectionHandle: string, limit: number = 10): Promise<ShopifyProduct[]> {
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
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                    quantityAvailable
                  }
                }
              }
              previewAudio: metafield(namespace: "custom", key: "preview_audio_url") {
                reference {
                  ... on GenericFile {
                    url
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

  return data.collectionByHandle.products.edges.map((edge: any) => ({
    ...edge.node,
    audioPreviewUrl: edge.node.previewAudio?.reference?.url
  }))
}

export async function getProductsByHandle(handle: string) : Promise<ShopifyProduct | null> {
  const query = `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
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
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
              quantityAvailable
            }
          }
        }
        previewAudio: metafield(namespace: "custom", key: "preview_audio_url") {
          reference {
            ... on GenericFile {
              url
            }
          }
        }
      }
    }
  `

  const data = await shopifyFetch(query, { handle })

  if (!data.productByHandle) {
    return null
  }

  return {
    ...data.productByHandle,
    audioPreviewUrl: data.productByHandle.previewAudio?.reference?.url
  }
}

// ===== CART FUNCTIONS =====

export async function createCart(lines?: CartLineInput[]): Promise<ShopifyCart> {
  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                      handle
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
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const variables = { input: lines ? { lines } : {} }
  const data = await shopifyFetch(query, variables)

  if (data.cartCreate.userErrors?.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message)
  }

  return data.cartCreate.cart
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
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
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `

  const data = await shopifyFetch(query, { cartId })

  // Cart might not exist (expired or invalid ID)
  if (!data.cart) {
    return null
  }

  return data.cart
}

export async function addToCart(cartId: string, variantId: string, quantity: number): Promise<ShopifyCart> {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!){
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                      handle
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
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const variables = {
    cartId,
    lines: [
      {
        merchandiseId: variantId,
        quantity
      }
    ]
  }

  const data = await shopifyFetch(query, variables)

  if (data.cartLinesAdd.userErrors?.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors[0].message)
  }

  return data.cartLinesAdd.cart
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  const query = `
    mutation updateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                      handle
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
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const variables = {
    cartId,
    lines: [
      {
        id: lineId,
        quantity
      }
    ]
  }

  const data = await shopifyFetch(query, variables)

  if (data.cartLinesUpdate.userErrors?.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors[0].message)
  }

  return data.cartLinesUpdate.cart
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart> {
  const query = `
    mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                      handle
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
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const variables = {
    cartId,
    lineIds
  }

  const data = await shopifyFetch(query, variables)

  if (data.cartLinesRemove.userErrors?.length > 0) {
    throw new Error(data.cartLinesRemove.userErrors[0].message)
  }

  return data.cartLinesRemove.cart
}

// ===== ORDER FUNCTIONS =====

export async function getCustomerOrders(
  customerAccessToken: string,
  first: number = 10
): Promise<ShopifyOrder[]> {
  const query = `
    query getCustomerOrders($customerAccessToken: String!, $first: Int!) {
      customer(customerAccessToken: $customerAccessToken) {
        orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              orderNumber
              processedAt
              financialStatus
              fulfillmentStatus
              totalPrice {
                amount
                currencyCode
              }
              lineItems(first: 50) {
                edges {
                  node {
                    title
                    quantity
                    originalTotalPrice {
                      amount
                      currencyCode
                    }
                    variant {
                      id
                      title
                      image {
                        url
                        altText
                      }
                      product {
                        id
                        handle
                        title
                        previewAudio: metafield(namespace: "custom", key: "preview_audio_url") {
                          reference {
                            ... on GenericFile {
                              url
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const data = await shopifyFetch(query, { customerAccessToken, first })

  // If customer doesn't exist or token is invalid
  if (!data.customer) {
    return []
  }

  return data.customer.orders.edges.map((edge: any) => ({
    ...edge.node,
    lineItems: {
      edges: edge.node.lineItems.edges.map((lineEdge: any) => ({
        node: {
          ...lineEdge.node,
          variant: lineEdge.node.variant ? {
            ...lineEdge.node.variant,
            product: {
              ...lineEdge.node.variant.product,
              audioPreviewUrl: lineEdge.node.variant.product.previewAudio?.reference?.url
            }
          } : undefined
        }
      }))
    }
  }))
}
