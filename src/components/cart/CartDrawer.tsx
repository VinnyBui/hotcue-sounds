"use client"

import { useState, useEffect } from "react"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { useCartStore } from "@/store/cartStore"
import { getCustomer } from "@/lib/shopify-auth"
import CartItem from "./CartItem"

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { cart, isLoading } = useCartStore()
  const [customerEmail, setCustomerEmail] = useState<string | null>(null)

  useEffect(() => {
    // Check if customer is logged in and get their email
    const checkAuth = async () => {
      const token = localStorage.getItem('shopify_access_token')
      if (token) {
        try {
          const result = await getCustomer(token)
          if (result.success && result.customer) {
            setCustomerEmail(result.customer.email)
          }
        } catch (error) {
          console.error('Failed to get customer:', error)
        }
      }
    }
    checkAuth()
  }, [])

  const formatPrice = (amount: string, currencyCode: string) => {
    const price = parseFloat(amount)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price)
  }

  const handleCheckout = () => {
    if (cart?.checkoutUrl) {
      let checkoutUrl = cart.checkoutUrl

      // If user is logged in, append their email to pre-fill checkout
      if (customerEmail) {
        const separator = checkoutUrl.includes('?') ? '&' : '?'
        checkoutUrl = `${checkoutUrl}${separator}checkout[email]=${encodeURIComponent(customerEmail)}`
      }

      window.location.href = checkoutUrl
    }
  }

  const itemCount = cart?.totalQuantity || 0
  const hasItems = itemCount > 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart
            {hasItems && (
              <span className="text-muted-foreground font-normal text-sm">
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto -mx-4 px-4">
          {isLoading && !cart && (
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">Loading cart...</p>
            </div>
          )}

          {!isLoading && !hasItems && (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
              <div className="text-center">
                <p className="font-semibold text-lg mb-1">Your cart is empty</p>
                <p className="text-muted-foreground text-sm">
                  Add some sound packs to get started
                </p>
              </div>
            </div>
          )}

          {hasItems && cart && (
            <div className="space-y-0 px-5">
              {cart.lines.edges.map((edge) => (
                <CartItem key={edge.node.id} item={edge.node} />
              ))}
            </div>
          )}
        </div>

        {/* Footer with Totals and Checkout */}
        {hasItems && cart && (
          <SheetFooter className="flex-col gap-4 mt-4">
            {/* Subtotal */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">
                  {formatPrice(
                    cart.cost.subtotalAmount.amount,
                    cart.cost.subtotalAmount.currencyCode
                  )}
                </span>
              </div>
              {cart.cost.totalTaxAmount && parseFloat(cart.cost.totalTaxAmount.amount) > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Estimated Tax</span>
                  <span>
                    {formatPrice(
                      cart.cost.totalTaxAmount.amount,
                      cart.cost.totalTaxAmount.currencyCode
                    )}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-lg">
                  {formatPrice(
                    cart.cost.totalAmount.amount,
                    cart.cost.totalAmount.currencyCode
                  )}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              className="w-full"
              size="lg"
              disabled={!cart.checkoutUrl}
            >
              Checkout
            </Button>
            <p className=" text-muted-foreground text-center">
              Use code <strong className="text-white">PORTFOLIOFREE</strong> for 100% off at checkout!
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Secure checkout powered by Shopify
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
