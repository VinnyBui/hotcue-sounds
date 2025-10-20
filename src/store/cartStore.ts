import { create } from 'zustand'
import {
  ShopifyCart,
  createCart,
  getCart,
  addToCart,
  updateCartLine,
  removeFromCart
} from '@/lib/shopify'

interface CartStore {
  // STATE
  cart: ShopifyCart | null
  cartId: string | null
  isLoading: boolean

  // ACTIONS
  initializeCart: () => Promise<void>
  addItem: (variantId: string, quantity: number) => Promise<void>
  updateItem: (lineId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  clearCart: () => void
}

// create<CartStore> - Creates a Zustand store with the CartStore interface
export const useCartStore = create<CartStore>((set, get) => ({
  // Initial state
  cart: null,
  cartId: null,
  isLoading: false,

  // Initialize cart on app load (restore from localStorage)
  initializeCart: async () => {
    set({ isLoading: true })

    try {
      const savedCartId = localStorage.getItem('shopify_cart_id')

      if (savedCartId) {
        const cart = await getCart(savedCartId)

        if (cart) {
          // Cart still exists in Shopify
          set({ cart, cartId: savedCartId, isLoading: false })
        } else {
          // Cart expired (Shopify carts expire after 10 days)
          localStorage.removeItem('shopify_cart_id')
          set({ cart: null, cartId: null, isLoading: false })
        }
      } else {
        // No saved cart ID
        set({ isLoading: false })
      }
    } catch (error) {
      console.error('Failed to initialize cart:', error)
      set({ isLoading: false })
    }
  },

  // Add item to cart
  addItem: async (variantId: string, quantity: number) => {
    set({ isLoading: true })

    try {
      const { cartId } = get()

      if (!cartId) {
        // No cart exists yet, create one with the item
        const cart = await createCart([{ merchandiseId: variantId, quantity }])
        localStorage.setItem('shopify_cart_id', cart.id)
        set({ cart, cartId: cart.id, isLoading: false })
      } else {
        // Cart exists, add item to it
        const cart = await addToCart(cartId, variantId, quantity)
        set({ cart, isLoading: false })
      }
    } catch (error) {
      console.error('Failed to add item:', error)
      set({ isLoading: false })
      throw error
    }
  },

  // Update item quantity in cart
  updateItem: async (lineId: string, quantity: number) => {
    set({ isLoading: true })

    try {
      const { cartId } = get()

      if (!cartId) {
        throw new Error('No cart ID')
      }

      const cart = await updateCartLine(cartId, lineId, quantity)
      set({ cart, isLoading: false })
    } catch (error) {
      console.error('Failed to update item:', error)
      set({ isLoading: false })
      throw error
    }
  },

  // Remove item from cart
  removeItem: async (lineId: string) => {
    set({ isLoading: true })

    try {
      const { cartId } = get()

      if (!cartId) {
        throw new Error('No cart ID')
      }

      const cart = await removeFromCart(cartId, [lineId])
      set({ cart, isLoading: false })
    } catch (error) {
      console.error('Failed to remove item:', error)
      set({ isLoading: false })
      throw error
    }
  },

  // Clear cart and remove from localStorage
  clearCart: () => {
    localStorage.removeItem('shopify_cart_id')
    set({ cart: null, cartId: null })
  }
}))