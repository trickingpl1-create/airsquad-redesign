'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Database } from '@/lib/types/database'

type Product = Database['public']['Tables']['products']['Row']

export interface CartItem extends Product {
  quantity: number
  size?: string
  color?: string
}

const CART_STORAGE_KEY = 'airsquad_cart'

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      try {
        setCart(JSON.parse(stored))
      } catch (error) {
        console.error('[v0] Error loading cart:', error)
        setCart([])
      }
    }
    setIsLoading(false)
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    }
  }, [cart, isLoading])

  const addItem = useCallback((product: Product, quantity = 1, size?: string, color?: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => item.id === product.id && item.size === size && item.color === color
      )

      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...prevCart, { ...product, quantity, size, color }]
    })
  }, [])

  const removeItem = useCallback((productId: string, size?: string, color?: string) => {
    setCart(prevCart =>
      prevCart.filter(item => !(item.id === productId && item.size === size && item.color === color))
    )
  }, [])

  const updateQuantity = useCallback(
    (productId: string, quantity: number, size?: string, color?: string) => {
      if (quantity <= 0) {
        removeItem(productId, size, color)
        return
      }
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId && item.size === size && item.color === color
            ? { ...item, quantity }
            : item
        )
      )
    },
    [removeItem]
  )

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return {
    cart,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  }
}
