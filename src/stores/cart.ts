import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Car, CartItem } from '@/types'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])
  const loading = ref(false)

  // Getters
  const cartItems = computed(() => items.value)
  
  const itemCount = computed(() => items.value.length)
  
  const totalAmount = computed(() => 
    items.value.reduce((sum, item) => {
      const price = item.car?.price || 0
      return sum + (price * (item.quantity || 1))
    }, 0)
  )
  
  const isEmpty = computed(() => items.value.length === 0)

  // Check if car is in cart
  const isInCart = (carId: string) => {
    return items.value.some(item => item.car.id === carId)
  }

  // Get specific item by car ID
  const getItemById = (carId: string) => {
    return items.value.find(item => item.car.id === carId)
  }

  // Actions
  const addToCart = (car: Car, notes?: string) => {
    // Validate car object
    if (!car || !car.id) {
      console.error('Invalid car object:', car)
      return false
    }

    // Check if already in cart (prevent duplicates)
    if (isInCart(car.id)) {
      console.log('Car already in cart:', car.brand, car.model)
      return false
    }
    
    items.value.push({
      car,
      quantity: 1,
      reservationDate: new Date(),
      notes: notes || ''
    })
    
    console.log('Added to cart:', car.brand, car.model)
    saveToLocalStorage()
    return true
  }

  const removeFromCart = (carId: string) => {
    const index = items.value.findIndex(item => item.car.id === carId)
    if (index > -1) {
      const removed = items.value[index]
      items.value.splice(index, 1)
      console.log('Removed from cart:', removed.car.brand, removed.car.model)
      saveToLocalStorage()
    }
  }

  const updateNotes = (carId: string, notes: string) => {
    const item = items.value.find(item => item.car.id === carId)
    if (item) {
      item.notes = notes
      console.log('Updated notes for:', item.car.brand, item.car.model)
      saveToLocalStorage()
    }
  }

  const updateQuantity = (carId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(carId)
      return
    }
    
    const item = items.value.find(item => item.car.id === carId)
    if (item) {
      item.quantity = quantity
      saveToLocalStorage()
    }
  }

  const updateReservationDate = (carId: string, date: Date) => {
    const item = items.value.find(item => item.car.id === carId)
    if (item) {
      item.reservationDate = date
      saveToLocalStorage()
    }
  }

  const clearCart = () => {
    items.value = []
    localStorage.removeItem('cart')
    console.log('Cart cleared')
  }

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('cart', JSON.stringify(items.value))
    } catch (e) {
      console.error('Failed to save cart:', e)
    }
  }

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          items.value = parsed
          console.log('Cart loaded:', items.value.length, 'items')
        }
      } catch (e) {
        console.error('Failed to load cart:', e)
        items.value = []
      }
    }
  }

  // Debug helper
  const debugCart = () => {
    console.log('=== CART DEBUG ===')
    console.log('Items count:', items.value.length)
    console.log('Total:', totalAmount.value)
    items.value.forEach((item, i) => {
      console.log(`${i + 1}. ${item.car.brand} ${item.car.model} - $${item.car.price} x ${item.quantity}`)
    })
    console.log('==================')
  }

  return {
    // State
    items,
    loading,
    // Getters
    cartItems,
    itemCount,
    totalAmount,
    isEmpty,
    isInCart,
    getItemById,
    // Actions
    addToCart,
    removeFromCart,
    updateNotes,
    updateQuantity,
    updateReservationDate,
    clearCart,
    loadFromLocalStorage,
    debugCart
  }
})