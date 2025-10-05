"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createCustomer, loginCustomer } from "@/lib/shopify-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    acceptsMarketing: false,
  })
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    setIsLoading(true)

    try {
      // Step 1: Create customer account
      const createResult = await createCustomer(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.acceptsMarketing
      )

      if (!createResult.success) {
        setErrors(createResult.errors || ["Signup failed. Please try again."])
        setIsLoading(false)
        return
      }

      // Step 2: Auto-login after successful signup
      const loginResult = await loginCustomer(formData.email, formData.password)

      if (loginResult.success && loginResult.accessToken) {
        // Store token in localStorage
        localStorage.setItem("shopify_access_token", loginResult.accessToken.accessToken)
        localStorage.setItem("shopify_token_expires", loginResult.accessToken.expiresAt)

        // Notify NavBar of auth state change
        window.dispatchEvent(new Event("authStateChanged"))

        // Redirect to account page
        router.push("/account")
      } else {
        // Account created but login failed - redirect to login page
        router.push("/login")
      }
    } catch (error) {
      setErrors(["An unexpected error occurred. Please try again."])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Sign up to start shopping for DJ sounds and samples
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            {errors.length > 0 && (
              <div className="rounded-md bg-destructive/10 p-3">
                <ul className="text-sm text-destructive space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="acceptsMarketing"
                name="acceptsMarketing"
                type="checkbox"
                checked={formData.acceptsMarketing}
                onChange={handleChange}
                disabled={isLoading}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="acceptsMarketing" className="text-sm font-normal">
                I want to receive marketing emails
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
