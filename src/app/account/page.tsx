"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCustomer, logoutCustomer } from "@/lib/shopify-auth"
import { CustomerData } from "@/lib/shopify-auth"
import { getCustomerOrders, ShopifyOrder } from "@/lib/shopify"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

export default function AccountPage() {
  const router = useRouter()
  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [orders, setOrders] = useState<ShopifyOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomerData = async () => {
      // Check for token in localStorage
      const token = localStorage.getItem("shopify_access_token")

      if (!token) {
        // No token found, redirect to login
        router.push("/login")
        return
      }

      try {
        // Fetch customer data using token
        const result = await getCustomer(token)

        if (result.success && result.customer) {
          setCustomer(result.customer)

          // Fetch customer orders
          setIsLoadingOrders(true)
          try {
            const customerOrders = await getCustomerOrders(token, 20)
            setOrders(customerOrders)
          } catch (orderError) {
            console.error("Failed to load orders:", orderError)
          } finally {
            setIsLoadingOrders(false)
          }
        } else {
          // Token invalid or expired, clear storage and redirect
          localStorage.removeItem("shopify_access_token")
          localStorage.removeItem("shopify_token_expires")
          router.push("/login")
        }
      } catch (error) {
        setError("Failed to load account data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomerData()
  }, [router])

  const handleLogout = async () => {
    const token = localStorage.getItem("shopify_access_token")

    if (token) {
      // Call Shopify API to invalidate token
      await logoutCustomer(token)
    }

    // Clear client-side storage
    localStorage.removeItem("shopify_access_token")
    localStorage.removeItem("shopify_token_expires")

    // Notify NavBar of auth state change
    window.dispatchEvent(new Event("authStateChanged"))

    // Redirect to home
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-100px)] items-center justify-center">
        <p className="text-muted-foreground">Loading account...</p>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="flex min-h-[calc(100vh-100px)] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              {error || "Failed to load account data"}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/login")} className="w-full">
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-[calc(100vh-100px)] px-4 py-8 md:px-20 lg:px-40">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-base">
                    {customer.firstName} {customer.lastName}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base">{customer.email}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-base">{customer.phone || "Not provided"}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Marketing Emails
                  </p>
                  <p className="text-base">
                    {customer.acceptsMarketing ? "Subscribed" : "Not subscribed"}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button variant="outline" onClick={() => router.push("/")} className="w-full">
                Back to Home
              </Button>
              <Button variant="destructive" onClick={handleLogout} className="w-full">
                Logout
              </Button>
            </CardFooter>
          </Card>

          {/* Order History Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View your past purchases</CardDescription>
            </CardHeader>
          <CardContent>
            {isLoadingOrders ? (
              <div className="flex justify-center py-8">
                <p className="text-muted-foreground">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <Link href="/products">
                  <Button>Browse Products</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold">Order #{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.processedAt)}
                        </p>
                      </div>
                    </div>

                    {/* Product Downloads */}
                    <div className="space-y-2">
                      {order.lineItems.edges.map(({ node: item }) => {
                        const audioUrl = item.variant?.product?.audioPreviewUrl
                        const productTitle = item.variant?.product?.title || item.title
                        // Create filename from product title
                        const filename = `${productTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.wav`
                        // Create download URL through our API route
                        const downloadUrl = audioUrl
                          ? `/api/download?url=${encodeURIComponent(audioUrl)}&filename=${encodeURIComponent(filename)}`
                          : null

                        return (
                          <div key={item.variant?.id || item.title} className="flex items-center justify-between gap-3 p-2 bg-accent/30 rounded">
                            <p className="font-medium text-sm">{productTitle}</p>
                            {downloadUrl ? (
                              <a
                                href={downloadUrl}
                                className="shrink-0"
                              >
                                <Button size="sm" variant="outline">
                                  Download
                                </Button>
                              </a>
                            ) : (
                              <span className="text-xs text-muted-foreground">No download available</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}
