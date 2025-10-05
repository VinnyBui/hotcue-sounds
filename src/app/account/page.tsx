"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCustomer, logoutCustomer } from "@/lib/shopify-auth"
import { CustomerData } from "@/lib/shopify-auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AccountPage() {
  const router = useRouter()
  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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

  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>My Account</CardTitle>
          <CardDescription>Manage your profile and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Home
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
