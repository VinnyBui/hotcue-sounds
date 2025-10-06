import { NextRequest, NextResponse } from "next/server"
import { getProducts, getProductsByCollection } from "@/lib/shopify"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const collection = searchParams.get("collection")

    let products

    if (collection) {
      // Get products from specific collection
      products = await getProductsByCollection(collection, 10)
    } else {
      // Get all products
      products = await getProducts(10)
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch products", products: [] },
      { status: 500 }
    )
  }
}
