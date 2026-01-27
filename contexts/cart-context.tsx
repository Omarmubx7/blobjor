"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

// Design configuration for custom designs
export interface DesignConfig {
  position_x: number
  position_y: number
  scale: number
  rotation: number
  side: "front" | "back"
  canvasJson?: object
  assetUrls?: string[]
}

// Custom design data attached to cart item
export interface CustomDesignData {
  designImageUrl: string // Base64 or uploaded URL
  mockupImageUrl?: string // Preview with product
  config: DesignConfig
  notes?: string
  productColor: string
}

export interface CartItem {
  id: number
  title: string
  titleAr: string
  price: number
  image: string
  size: string
  quantity: number
  category: "hoodies" | "mugs" | "scarves" | "keychains" | "oldmoney"
  // Custom design fields
  isCustomDesign?: boolean
  customDesign?: CustomDesignData
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: number, size: string) => void
  updateQuantity: (id: number, size: string, quantity: number) => void
  clearCart: () => void
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("blob-cart")
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (e) {
      console.warn("Failed to load cart from storage:", e)
    }
    setIsHydrated(true)
  }, [])

  // Save cart to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("blob-cart", JSON.stringify(items))
      } catch (e) {
        console.warn("Failed to save cart to storage:", e)
      }
    }
  }, [items, isHydrated])

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === newItem.id && item.size === newItem.size
      )

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === newItem.id && item.size === newItem.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...currentItems, { ...newItem, quantity: 1 }]
    })

    // Open cart drawer when item is added
    setIsCartOpen(true)
  }

  const removeItem = (id: number, size: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => !(item.id === id && item.size === size))
    )
  }

  const updateQuantity = (id: number, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id, size)
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
