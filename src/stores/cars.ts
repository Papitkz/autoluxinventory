import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  writeBatch
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import type { Car, FilterOptions } from '@/types'

export const useCarsStore = defineStore('cars', () => {
  // State
  const cars = ref<Car[]>([])
  const currentCar = ref<Car | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<FilterOptions>({})

  // Getters
  const allCars = computed(() => cars.value)
  
  const availableCars = computed(() => 
    cars.value.filter(car => car.status === 'available')
  )
  
  const featuredCars = computed(() => 
    cars.value.filter(car => car.status === 'available').slice(0, 6)
  )
  
  const filteredCars = computed(() => {
    let result = cars.value
    
    if (filters.value.brand) {
      result = result.filter(car => 
        car.brand.toLowerCase().includes(filters.value.brand!.toLowerCase())
      )
    }
    
    if (filters.value.category) {
      result = result.filter(car => car.category === filters.value.category)
    }
    
    if (filters.value.minPrice) {
      result = result.filter(car => car.price >= filters.value.minPrice!)
    }
    
    if (filters.value.maxPrice) {
      result = result.filter(car => car.price <= filters.value.maxPrice!)
    }
    
    if (filters.value.minYear) {
      result = result.filter(car => car.year >= filters.value.minYear!)
    }
    
    if (filters.value.maxYear) {
      result = result.filter(car => car.year <= filters.value.maxYear!)
    }
    
    if (filters.value.fuelType) {
      result = result.filter(car => car.fuelType === filters.value.fuelType)
    }
    
    if (filters.value.transmission) {
      result = result.filter(car => car.transmission === filters.value.transmission)
    }
    
    if (filters.value.status) {
      result = result.filter(car => car.status === filters.value.status)
    }
    
    return result
  })
  
  const brands = computed(() => 
    [...new Set(cars.value.map(car => car.brand))].sort()
  )
  
  const categories = computed(() => 
    [...new Set(cars.value.map(car => car.category))]
  )

  // ============================================
  // HELPER: Clean undefined values from object
  // ============================================
  
  const cleanData = (data: any): any => {
    const cleaned: any = {}
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleaned[key] = value
      }
    }
    return cleaned
  }

  // Generate search keywords for better filtering
  const generateSearchKeywords = (carData: any): string[] => {
    const keywords = new Set<string>()
    const brand = carData.brand?.toString().toLowerCase() || ''
    const model = carData.model?.toString().toLowerCase() || ''
    const year = carData.year?.toString() || ''
    const category = carData.category?.toString().toLowerCase() || ''
    
    keywords.add(brand)
    keywords.add(model)
    keywords.add(year)
    keywords.add(category)
    keywords.add(`${brand} ${model}`)
    keywords.add(`${year} ${brand}`)
    keywords.add(`${brand} ${year}`)
    
    // Add partial words
    brand.split(' ').forEach((word: string) => word.length > 2 && keywords.add(word))
    model.split(' ').forEach((word: string) => word.length > 2 && keywords.add(word))
    
    return Array.from(keywords)
  }

  // Log activity to Firestore
  const logActivity = async (action: string, details: any) => {
    try {
      await addDoc(collection(db, 'activityLogs'), {
        action,
        details: cleanData(details),
        timestamp: serverTimestamp(),
        _created: new Date().toISOString()
      })
    } catch (err) {
      console.error('Failed to log activity:', err)
    }
  }

  // Update statistics
  const updateStats = async (field: string, value: number) => {
    try {
      const statsRef = doc(db, 'statistics', 'inventory')
      await updateDoc(statsRef, {
        [field]: increment(value),
        lastUpdated: serverTimestamp()
      }).catch(async () => {
        // Create if doesn't exist
        await addDoc(collection(db, 'statistics'), {
          id: 'inventory',
          [field]: value,
          lastUpdated: serverTimestamp()
        })
      })
    } catch (err) {
      console.error('Failed to update stats:', err)
    }
  }

  // Notify admins (creates notification documents)
  const notifyAdmins = async (type: string, data: any) => {
    try {
      const adminsSnap = await getDocs(
        query(collection(db, 'users'), where('role', '==', 'admin'))
      )
      
      const notifications = adminsSnap.docs.map(adminDoc => 
        addDoc(collection(db, 'notifications'), {
          userId: adminDoc.id,
          type,
          title: data.title,
          body: data.body,
          read: false,
          data: {
            ...cleanData(data),
            createdAt: serverTimestamp()
          },
          createdAt: serverTimestamp()
        })
      )
      
      await Promise.all(notifications)
    } catch (err) {
      console.error('Failed to notify admins:', err)
    }
  }

  // Handle car sold - cancel pending reservations
  const handleCarSold = async (carId: string, carData: any) => {
    try {
      const reservationsSnap = await getDocs(
        query(
          collection(db, 'reservations'),
          where('carId', '==', carId),
          where('status', 'in', ['pending', 'approved'])
        )
      )
      
      const batch = writeBatch(db)
      reservationsSnap.docs.forEach(doc => {
        batch.update(doc.ref, {
          status: 'cancelled',
          reason: 'Vehicle sold to another customer',
          updatedAt: serverTimestamp()
        })
      })
      
      await batch.commit()
      
      await logActivity('car_sold', {
        carId,
        brand: carData.brand,
        model: carData.model,
        finalPrice: carData.price
      })
    } catch (err) {
      console.error('Failed to handle car sold:', err)
    }
  }

  // Clean up related data when car deleted
  const cleanupCarRelations = async (carId: string, carData: any) => {
    try {
      const batch = writeBatch(db)
      
      // Delete from favorites
      const favoritesSnap = await getDocs(
        query(collectionGroup(db, 'favorites'), where('carId', '==', carId))
      )
      favoritesSnap.docs.forEach(doc => batch.delete(doc.ref))
      
      // Cancel reservations
      const reservationsSnap = await getDocs(
        query(
          collection(db, 'reservations'),
          where('carId', '==', carId),
          where('status', 'in', ['pending', 'approved'])
        )
      )
      reservationsSnap.docs.forEach(doc => {
        batch.update(doc.ref, {
          status: 'cancelled',
          reason: 'Vehicle removed from inventory',
          cancelledAt: serverTimestamp()
        })
      })
      
      await batch.commit()
      
      await updateStats('totalCars', -1)
      
      await logActivity('car_deleted', {
        carId,
        brand: carData.brand,
        model: carData.model
      })
    } catch (err) {
      console.error('Failed to cleanup car relations:', err)
    }
  }

  // ============================================
  // MAIN ACTIONS with TRIGGERS
  // ============================================

  const fetchCars = async () => {
    loading.value = true
    error.value = null
    
    try {
      const q = query(collection(db, 'cars'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      cars.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Car[]
    } catch (err: any) {
      error.value = err.message
      console.error('fetchCars error:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchCarById = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const docRef = doc(db, 'cars', id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        currentCar.value = { id: docSnap.id, ...docSnap.data() } as Car
        return currentCar.value
      } else {
        error.value = 'Car not found'
        return null
      }
    } catch (err: any) {
      error.value = err.message
      console.error('fetchCarById error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // ADD CAR with triggers - FIXED: Clean undefined values
  const addCar = async (carData: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>, userId?: string) => {
    loading.value = true
    error.value = null
    
    try {
      // Validate required fields
      if (!carData.brand || !carData.model || !carData.year || !carData.price) {
        throw new Error('Missing required fields: brand, model, year, price')
      }

      // Prepare enriched data
      const enrichedData = {
        ...carData,
        // Normalize to lowercase
        status: carData.status?.toLowerCase() || 'available',
        category: carData.category?.toLowerCase() || 'sedan',
        fuelType: carData.fuelType?.toLowerCase() || 'gasoline',
        transmission: carData.transmission?.toLowerCase() || 'automatic',
        // Add computed fields
        searchKeywords: generateSearchKeywords(carData),
        // Add analytics fields
        views: 0,
        inquiries: 0,
        lastViewedAt: null,
        // Track who added
        createdBy: userId || 'anonymous',
        updatedBy: userId || 'anonymous'
      }

      // CRITICAL: Remove undefined values before saving to Firestore
      const cleanedData = cleanData(enrichedData)

      console.log('Adding car to Firestore:', cleanedData)

      const docRef = await addDoc(collection(db, 'cars'), {
        ...cleanedData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      console.log('Car added successfully with ID:', docRef.id)
      
      const newCar = { 
        id: docRef.id, 
        ...cleanedData,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Car
      
      cars.value.unshift(newCar)
      
      // TRIGGER: Notify admins
      await notifyAdmins('new_car', {
        title: 'New Vehicle Added',
        body: `${newCar.brand} ${newCar.model} (${newCar.year}) - $${newCar.price?.toLocaleString()}`,
        carId: docRef.id,
        type: 'inventory'
      })
      
      // TRIGGER: Log activity
      await logActivity('car_created', {
        carId: docRef.id,
        brand: newCar.brand,
        model: newCar.model,
        price: newCar.price,
        addedBy: userId || 'anonymous'
      })
      
      // TRIGGER: Update stats
      await updateStats('totalCars', 1)
      
      return newCar
    } catch (err: any) {
      error.value = err.message
      console.error('addCar error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // UPDATE CAR with triggers - FIXED: Clean undefined values
  const updateCar = async (id: string, carData: Partial<Car>, userId?: string) => {
    loading.value = true
    error.value = null
    
    try {
      const carRef = doc(db, 'cars', id)
      const oldCarSnap = await getDoc(carRef)
      
      if (!oldCarSnap.exists()) {
        throw new Error('Car not found')
      }
      
      const oldData = oldCarSnap.data()
      
      // Prepare updates
      const updates: any = {
        ...carData,
        updatedBy: userId || 'anonymous',
        updatedAt: serverTimestamp()
      }
      
      // Normalize if present
      if (carData.status) updates.status = carData.status.toLowerCase()
      if (carData.category) updates.category = carData.category.toLowerCase()
      if (carData.fuelType) updates.fuelType = carData.fuelType.toLowerCase()
      if (carData.transmission) updates.transmission = carData.transmission.toLowerCase()
      
      // Regenerate keywords if brand/model/year changed
      if (carData.brand || carData.model || carData.year) {
        updates.searchKeywords = generateSearchKeywords({
          ...oldData,
          ...carData
        })
      }
      
      // CRITICAL: Remove undefined values before saving to Firestore
      const cleanedUpdates = cleanData(updates)

      console.log('Updating car:', id, cleanedUpdates)
      
      await updateDoc(carRef, cleanedUpdates)
      
      // Update local state
      const index = cars.value.findIndex(car => car.id === id)
      if (index !== -1) {
        cars.value[index] = { ...cars.value[index], ...cleanedUpdates, updatedAt: new Date() }
      }
      
      // TRIGGER: Check for status changes
      if (carData.status && carData.status !== oldData?.status) {
        if (carData.status === 'sold') {
          await handleCarSold(id, { ...oldData, ...carData })
        }
        
        await logActivity('status_changed', {
          carId: id,
          brand: oldData?.brand,
          model: oldData?.model,
          from: oldData?.status,
          to: carData.status,
          changedBy: userId || 'anonymous'
        })
      }
      
      // TRIGGER: Log price change
      if (carData.price && carData.price !== oldData?.price) {
        await logActivity('price_changed', {
          carId: id,
          brand: oldData?.brand,
          model: oldData?.model,
          oldPrice: oldData?.price,
          newPrice: carData.price,
          changedBy: userId || 'anonymous'
        })
      }
      
      console.log('Car updated successfully')
      return true
    } catch (err: any) {
      error.value = err.message
      console.error('updateCar error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // DELETE CAR with triggers
  const deleteCar = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      // Get car data before deleting (for triggers)
      const carRef = doc(db, 'cars', id)
      const carSnap = await getDoc(carRef)
      const carData = carSnap.data()
      
      // TRIGGER: Cleanup relations before delete
      if (carData) {
        await cleanupCarRelations(id, carData)
      }
      
      // Delete the car
      await deleteDoc(carRef)
      cars.value = cars.value.filter(car => car.id !== id)
      
      console.log('Car deleted successfully:', id)
      return true
    } catch (err: any) {
      error.value = err.message
      console.error('deleteCar error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // INCREMENT VIEW COUNT (call when viewing car detail)
  const incrementViews = async (id: string) => {
    try {
      const carRef = doc(db, 'cars', id)
      await updateDoc(carRef, {
        views: increment(1),
        lastViewedAt: serverTimestamp()
      })
    } catch (err) {
      console.error('Failed to increment views:', err)
    }
  }

  const setFilters = (newFilters: FilterOptions) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {}
  }

  const clearError = () => {
    error.value = null
  }

  return {
    cars,
    currentCar,
    loading,
    error,
    filters,
    allCars,
    availableCars,
    featuredCars,
    filteredCars,
    brands,
    categories,
    fetchCars,
    fetchCarById,
    addCar,
    updateCar,
    deleteCar,
    incrementViews,
    setFilters,
    clearFilters,
    clearError
  }
})