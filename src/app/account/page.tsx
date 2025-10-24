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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Image from "next/image"
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

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(parseFloat(amount))
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "fulfilled":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "pending":
      case "unfulfilled":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "refunded":
      case "canceled":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
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
              <Accordion type="single" collapsible className="w-full">
                {orders.map((order) => (
                  <AccordionItem key={order.id} value={order.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex flex-col md:flex-row md:items-center justify-between w-full pr-4 gap-2">
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-semibold">
                            Order #{order.orderNumber}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(order.processedAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(
                              order.fulfillmentStatus
                            )}`}
                          >
                            {order.fulfillmentStatus || "Unfulfilled"}
                          </span>
                          <span className="font-semibold">
                            {formatPrice(
                              order.totalPrice.amount,
                              order.totalPrice.currencyCode
                            )}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        {order.lineItems.edges.map(({ node: item }) => (
                          <div
                            key={item.variant?.id || item.title}
                            className="flex gap-4 border-b pb-4 last:border-0"
                          >
                            {item.variant?.image && (
                              <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                                <Image
                                  src={item.variant.image.url}
                                  alt={
                                    item.variant.image.altText || item.title
                                  }
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {item.title}
                              </p>
                              {item.variant?.title &&
                                item.variant.title !== "Default Title" && (
                                  <p className="text-sm text-muted-foreground">
                                    {item.variant.title}
                                  </p>
                                )}
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-medium">
                                {formatPrice(
                                  item.originalTotalPrice.amount,
                                  item.originalTotalPrice.currencyCode
                                )}
                              </p>
                              {item.variant?.product && (
                                <Link
                                  href={`/products/${item.variant.product.handle}`}
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  View Product
                                </Link>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="font-medium">Total</span>
                          <span className="font-bold text-lg">
                            {formatPrice(
                              order.totalPrice.amount,
                              order.totalPrice.currencyCode
                            )}
                          </span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}
