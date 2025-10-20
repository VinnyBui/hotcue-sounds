"use client"

import { useState, useEffect } from "react"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cartStore"
import { ShopifyCartLine } from "@/lib/shopify"
import { useTheme } from "next-themes"

interface CartItemProps {
  item: ShopifyCartLine
}

export default function CartItem({ item }: CartItemProps) {
  const { updateItem, removeItem } = useCartStore()
  const { theme, resolvedTheme } = useTheme()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const formatPrice = (amount: string, currencyCode: string) => {
    const price = parseFloat(amount)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price)
  }

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return

    setIsUpdating(true)
    try {
      await updateItem(item.id, newQuantity)
    } catch (error) {
      console.error("Failed to update quantity:", error)
      alert("Failed to update quantity. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    setIsRemoving(true)
    try {
      await removeItem(item.id)
    } catch (error) {
      console.error("Failed to remove item:", error)
      alert("Failed to remove item. Please try again.")
    } finally {
      setIsRemoving(false)
    }
  }

  // Theme-aware image selection (same logic as ProductCard)
  const images = item.merchandise.product.images.edges
  let productImage: string

  if (images.length > 0) {
    const lightImage = images[0]?.node.url || '/images/soundpacks.png'
    const darkImage = images[1]?.node.url || lightImage

    // Use resolvedTheme to handle 'system' theme properly
    const currentTheme = mounted ? (resolvedTheme || theme) : 'light'
    const isDark = currentTheme === 'dark'

    productImage = isDark ? darkImage : lightImage
  } else {
    productImage = '/images/soundpacks.png'
  }

  const unitPrice = formatPrice(
    item.merchandise.price.amount,
    item.merchandise.price.currencyCode
  )

  // Calculate line total from unit price × quantity
  const lineTotalAmount = (parseFloat(item.merchandise.price.amount) * item.quantity).toFixed(2)
  const lineTotal = formatPrice(
    lineTotalAmount,
    item.merchandise.price.currencyCode
  )

  return (
    <div className="flex gap-4 py-4 border-b border-border">
      {/* Product Image */}
      <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-muted">
        <img
          src={productImage}
          alt={item.merchandise.product.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-sm line-clamp-2">
              {item.merchandise.product.title}
            </h3>
            {item.merchandise.title !== 'Default Title' && (
              <p className="text-xs text-muted-foreground mt-1">
                {item.merchandise.title}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 -mt-1 -mr-2"
            onClick={handleRemove}
            disabled={isRemoving || isUpdating}
          >
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>

        {/* Price and Quantity Controls */}
        <div className="flex justify-between items-center mt-auto">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              disabled={isUpdating || isRemoving || item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
              <span className="sr-only">Decrease quantity</span>
            </Button>
            <span className="text-sm font-medium w-8 text-center">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={isUpdating || isRemoving}
            >
              <Plus className="h-3 w-3" />
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-semibold text-sm">{lineTotal}</p>
            {item.quantity > 1 && (
              <p className="text-xs text-muted-foreground">
                {unitPrice} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
