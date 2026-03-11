import { defineStore } from 'pinia'
import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  addDoc, 
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { db, functions } from '@/firebase/config'
import type { Order, CartItem } from '@/types'

interface OrdersState {
  orders: Order[]
  userOrders: Order[]
  currentOrder: Order | null
  loading: boolean
  error: string | null
  unsubscribers: (() => void)[]
}

export const useOrdersStore = defineStore('orders', {
  state: (): OrdersState => ({
    orders: [],
    userOrders: [],
    currentOrder: null,
    loading: false,
    error: null,
    unsubscribers: []
  }),

  getters: {
    allOrders: (state) => state.orders,
    currentUserOrders: (state) => state.userOrders,
    
    pendingOrders: (state) => 
      state.orders.filter(order => order.status === 'pending'),
    
    confirmedOrders: (state) => 
      state.orders.filter(order => order.status === 'confirmed'),
    
    processingOrders: (state) => 
      state.orders.filter(order => order.status === 'processing'),
    
    completedOrders: (state) => 
      state.orders.filter(order => order.status === 'completed'),
    
    cancelledOrders: (state) => 
      state.orders.filter(order => order.status === 'cancelled'),
    
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error
  },

  actions: {
    async createOrder(
      userId: string,
      items: CartItem[],
      customerInfo: Order['customerInfo'],
      type: 'purchase' | 'reservation' = 'reservation',
      userEmail?: string,
      userDisplayName?: string,
      adminNotes?: string
    ) {
      this.loading = true
      this.error = null
      
      try {
        // Validation
        if (!userId) throw new Error('User not authenticated')
        if (!items || items.length === 0) throw new Error('Cart is empty')
        if (!customerInfo?.name?.trim()) throw new Error('Name is required')
        if (!customerInfo?.email?.trim()) throw new Error('Email is required')

        // Calculate total
        const totalAmount = items.reduce((sum, item) => {
          const price = Number(item.car?.price) || 0
          const qty = Number(item.quantity) || 1
          return sum + (price * qty)
        }, 0)

        // Prepare clean order data
        const orderData: any = {
          userId,
          items: items.map(item => ({
            car: {
              id: String(item.car.id),
              brand: String(item.car.brand || ''),
              model: String(item.car.model || ''),
              year: Number(item.car.year) || new Date().getFullYear(),
              price: Number(item.car.price) || 0,
              images: Array.isArray(item.car.images) ? item.car.images : [],
              color: String(item.car.color || ''),
              fuelType: String(item.car.fuelType || ''),
              transmission: String(item.car.transmission || ''),
              mileage: Number(item.car.mileage) || 0
            },
            quantity: Number(item.quantity) || 1,
            reservationDate: item.reservationDate || null,
            notes: String(item.notes || '')
          })),
          totalAmount: Number(totalAmount),
          status: 'pending' as const,
          type: type,
          customerInfo: {
            name: String(customerInfo.name).trim(),
            email: String(customerInfo.email).trim(),
            phone: String(customerInfo.phone || '').trim(),
            address: String(customerInfo.address || '').trim()
          },
          emailSent: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }

        // Add admin metadata if provided
        if (adminNotes) {
          orderData.adminNotes = adminNotes
          orderData.createdBy = 'admin'
        }

        console.log('📝 Creating order:', orderData)

        // Save to Firestore
        const docRef = await addDoc(collection(db, 'orders'), orderData)
        
        console.log('✅ Order saved with ID:', docRef.id)

        // Create order object for return
        const newOrder: Order = {
          id: docRef.id,
          userId: orderData.userId,
          items: orderData.items,
          totalAmount: orderData.totalAmount,
          status: orderData.status,
          type: orderData.type,
          customerInfo: orderData.customerInfo,
          emailSent: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        // Add to local state
        this.orders.unshift(newOrder)

        // Send email notifications (non-blocking)
        try {
          const sendOrderEmails = httpsCallable(functions, 'sendOrderEmails')
          
          await sendOrderEmails({
            orderId: docRef.id,
            orderData: newOrder,
            buyerEmail: customerInfo.email,
            buyerName: customerInfo.name,
            userEmail: userEmail || customerInfo.email,
            userDisplayName: userDisplayName || customerInfo.name,
            type: type
          })

          // Mark email as sent
          await updateDoc(doc(db, 'orders', docRef.id), {
            emailSent: true,
            emailSentAt: serverTimestamp()
          })
          
          newOrder.emailSent = true
          newOrder.emailSentAt = new Date()
          
          console.log('📧 Emails sent successfully')
        } catch (emailErr: any) {
          console.warn('⚠️ Email failed (order saved):', emailErr.message)
          // Order is saved, email is optional
        }

        return newOrder
        
      } catch (err: any) {
        console.error('❌ Order creation failed:', err)
        this.error = err.message
        return null
      } finally {
        this.loading = false
      }
    },

    async fetchAllOrders() {
      this.loading = true
      this.error = null
      
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)
        
        this.orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[]
        
      } catch (err: any) {
        this.error = err.message
        console.error('Failed to fetch orders:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchUserOrders(userId: string) {
      this.loading = true
      this.error = null
      
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        )
        const snapshot = await getDocs(q)
        
        this.userOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[]
        
      } catch (err: any) {
        this.error = err.message
        console.error('Failed to fetch user orders:', err)
      } finally {
        this.loading = false
      }
    },

    // Real-time subscription for user orders
    subscribeToUserOrders(userId: string): () => void {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        this.userOrders = snapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            // Convert Firestore Timestamps to Dates for consistency
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
            confirmedAt: data.confirmedAt?.toDate ? data.confirmedAt.toDate() : data.confirmedAt,
            processingAt: data.processingAt?.toDate ? data.processingAt.toDate() : data.processingAt,
            completedAt: data.completedAt?.toDate ? data.completedAt.toDate() : data.completedAt,
            cancelledAt: data.cancelledAt?.toDate ? data.cancelledAt.toDate() : data.cancelledAt,
            emailSentAt: data.emailSentAt?.toDate ? data.emailSentAt.toDate() : data.emailSentAt,
          }
        }) as Order[]
        
        // Update currentOrder if it's being viewed and was updated
        if (this.currentOrder) {
          const updated = this.userOrders.find(o => o.id === this.currentOrder!.id)
          if (updated) {
            this.currentOrder = updated
          }
        }
        
        console.log('📡 Real-time orders update:', this.userOrders.length, 'orders')
      }, (error) => {
        console.error('Orders subscription error:', error)
        this.error = error.message
      })
      
      this.unsubscribers.push(unsubscribe)
      return unsubscribe
    },

    // Real-time subscription for all orders (admin use)
    subscribeToAllOrders(): () => void {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        this.orders = snapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
            confirmedAt: data.confirmedAt?.toDate ? data.confirmedAt.toDate() : data.confirmedAt,
            processingAt: data.processingAt?.toDate ? data.processingAt.toDate() : data.processingAt,
            completedAt: data.completedAt?.toDate ? data.completedAt.toDate() : data.completedAt,
            cancelledAt: data.cancelledAt?.toDate ? data.cancelledAt.toDate() : data.cancelledAt,
            emailSentAt: data.emailSentAt?.toDate ? data.emailSentAt.toDate() : data.emailSentAt,
          }
        }) as Order[]
        
        // Update currentOrder if it's being viewed
        if (this.currentOrder) {
          const updated = this.orders.find(o => o.id === this.currentOrder!.id)
          if (updated) {
            this.currentOrder = updated
          }
        }
      }, (error) => {
        console.error('All orders subscription error:', error)
        this.error = error.message
      })
      
      this.unsubscribers.push(unsubscribe)
      return unsubscribe
    },

    unsubscribeAll() {
      this.unsubscribers.forEach(unsub => unsub())
      this.unsubscribers = []
    },

    async fetchOrderById(id: string) {
      this.loading = true
      this.error = null
      
      try {
        const docRef = doc(db, 'orders', id)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          this.currentOrder = { 
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
            confirmedAt: data.confirmedAt?.toDate ? data.confirmedAt.toDate() : data.confirmedAt,
            processingAt: data.processingAt?.toDate ? data.processingAt.toDate() : data.processingAt,
            completedAt: data.completedAt?.toDate ? data.completedAt.toDate() : data.completedAt,
            cancelledAt: data.cancelledAt?.toDate ? data.cancelledAt.toDate() : data.cancelledAt,
            emailSentAt: data.emailSentAt?.toDate ? data.emailSentAt.toDate() : data.emailSentAt,
          } as Order
          return this.currentOrder
        } else {
          this.error = 'Order not found'
          return null
        }
      } catch (err: any) {
        this.error = err.message
        return null
      } finally {
        this.loading = false
      }
    },

    async updateOrderStatus(id: string, status: Order['status'], adminId?: string) {
      this.loading = true
      this.error = null
      
      try {
        const docRef = doc(db, 'orders', id)
        
        // Build update object with status and timestamp
        const updates: any = {
          status,
          updatedAt: serverTimestamp(),
          updatedBy: adminId || 'system'
        }
        
        // Add specific timestamp fields for each status
        const now = serverTimestamp()
        switch (status) {
          case 'confirmed':
            updates.confirmedAt = now
            break
          case 'processing':
            updates.processingAt = now
            break
          case 'completed':
            updates.completedAt = now
            break
          case 'cancelled':
            updates.cancelledAt = now
            break
          case 'pending':
            // Reset other timestamps if going back to pending
            updates.confirmedAt = null
            updates.processingAt = null
            updates.completedAt = null
            break
        }
        
        await updateDoc(docRef, updates)
        
        // Update local state immediately for better UX
        const index = this.orders.findIndex(order => order.id === id)
        if (index !== -1) {
          this.orders[index].status = status
          this.orders[index].updatedAt = new Date()
          this.orders[index].updatedBy = adminId || 'system'
          
          // Add timestamp to local state
          const timestampField = `${status}At`
          if (status !== 'pending') {
            (this.orders[index] as any)[timestampField] = new Date()
          }
        }
        
        const userIndex = this.userOrders.findIndex(order => order.id === id)
        if (userIndex !== -1) {
          this.userOrders[userIndex].status = status
          this.userOrders[userIndex].updatedAt = new Date()
          this.userOrders[userIndex].updatedBy = adminId || 'system'
          
          const timestampField = `${status}At`
          if (status !== 'pending') {
            (this.userOrders[userIndex] as any)[timestampField] = new Date()
          }
        }
        
        if (this.currentOrder?.id === id) {
          this.currentOrder.status = status
          this.currentOrder.updatedAt = new Date()
          this.currentOrder.updatedBy = adminId || 'system'
          
          const timestampField = `${status}At`
          if (status !== 'pending') {
            (this.currentOrder as any)[timestampField] = new Date()
          }
        }
        
        console.log(`✅ Order ${id} status updated to ${status}`)
        return true
      } catch (err: any) {
        this.error = err.message
        console.error('Failed to update order status:', err)
        return false
      } finally {
        this.loading = false
      }
    },

    async addOrderNote(id: string, note: string, adminId?: string) {
      this.loading = true
      this.error = null
      
      try {
        const docRef = doc(db, 'orders', id)
        const noteData = {
          text: note,
          createdAt: serverTimestamp(),
          createdBy: adminId || 'system'
        }
        
        await updateDoc(docRef, {
          notes: arrayUnion(noteData),
          updatedAt: serverTimestamp()
        })
        
        return true
      } catch (err: any) {
        this.error = err.message
        return false
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    },

    setCurrentOrder(order: Order | null) {
      this.currentOrder = order
    },

    // Reset store (useful on logout)
    reset() {
      this.unsubscribeAll()
      this.orders = []
      this.userOrders = []
      this.currentOrder = null
      this.loading = false
      this.error = null
    }
  }
})