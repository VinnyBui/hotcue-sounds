"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { loginCustomer } from "@/lib/shopify-auth"
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

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [returnUrl, setReturnUrl] = useState<string>("/account")

  useEffect(() => {
    // Get return URL from query params
    const url = searchParams.get('returnUrl')
    if (url) {
      setReturnUrl(decodeURIComponent(url))
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    setIsLoading(true)

    try {
      const result = await loginCustomer(email, password)

      if (result.success && result.accessToken) {
        // Store token in localStorage
        localStorage.setItem("shopify_access_token", result.accessToken.accessToken)
        localStorage.setItem("shopify_token_expires", result.accessToken.expiresAt)

        // Notify NavBar of auth state change
        window.dispatchEvent(new Event("authStateChanged"))

        // Redirect to return URL or account page
        router.push(returnUrl)
      } else if (result.errors) {
        setErrors(result.errors)
      }
    } catch (err) {
      console.error("Login error:", err)
      setErrors(["An unexpected error occurred. Please try again."])
    } finally{
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {errors.length > 0 && (
              <div className="rounded-md bg-destructive/10 p-3">
                <ul className="text-sm text-destructive space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
