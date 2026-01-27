'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface Product {
  id: string
  name: string
  price: number
  images: { url: string }[]
}

interface AddToCartButtonProps {
  product: Product
  className?: string
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { toast } = useToast()

  const handleAddToCart = async () => {
    setIsLoading(true)

    try {
      // Get current cart from localStorage
      const existingCart = localStorage.getItem('blob-cart')
      const cart = existingCart ? JSON.parse(existingCart) : []

      // Check if product already in cart
      const existingItem = cart.find((item: { id: string }) => item.id === product.id)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0]?.url || '',
          quantity: 1,
        })
      }

      // Save back to localStorage
      localStorage.setItem('blob-cart', JSON.stringify(cart))

      // Dispatch custom event for cart update
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: { cart } }))
    } catch (e) {
      console.warn('Failed to access storage:', e)
    }

    // Show success state
    setIsAdded(true)
    toast({
      title: 'تمت الإضافة للسلة',
      description: `تم إضافة ${product.name} إلى سلة التسوق`,
    })

    // Reset after 2 seconds
    setTimeout(() => {
      setIsLoading(false)
      setIsAdded(false)
    }, 2000)
  }

  return (
    <Button
      size="lg"
      className={cn('gap-2', className)}
      onClick={handleAddToCart}
      disabled={isLoading || isAdded}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          جارٍ الإضافة...
        </>
      ) : isAdded ? (
        <>
          <Check className="h-5 w-5" />
          تمت الإضافة
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          أضف للسلة
        </>
      )}
    </Button>
  )
}
