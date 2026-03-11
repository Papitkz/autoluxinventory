export interface Car {
  id: string
  brand: string
  model: string
  year: number
  price: number
  originalPrice?: number
  mileage: number
  fuelType: string
  transmission: string
  color: string
  category: string
  status: 'available' | 'reserved' | 'sold'
  description: string
  features: string[]
  images: string[] // Main car images
  engine?: string
  horsepower?: number
  createdAt?: any
  updatedAt?: any
  createdBy?: string
  updatedBy?: string
  views?: number
  inquiries?: number
  searchKeywords?: string[]
  partImages?: {
    partId: string
    name: string
    url: string
    description?: string
  }[]
}

export interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  phone: string
  address: string
  role: 'user' | 'admin'
  emailVerified: boolean
  createdAt: Date
  updatedAt?: Date
}

export interface CartItem {
  car: Car
  quantity: number
  reservationDate?: Date
  notes?: string
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled'
  type: 'purchase' | 'reservation'
  customerInfo: {
    name: string
    email: string
    phone: string
    address: string
  }
  createdAt: Date
  updatedAt: Date
  emailSent?: boolean // Track if confirmation email was sent
  emailSentAt?: Date // When the email was sent
}

export interface Reservation {
  id: string
  userId: string
  carId: string
  car: Car
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed'
  reservationDate: Date
  expiryDate: Date
  deposit: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface CarPartImage {
  partId: string
  name: string
  url: string
  description?: string
}

export interface FilterOptions {
  brand?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  minYear?: number
  maxYear?: number
  fuelType?: string
  transmission?: string
  status?: string
}

// Email notification types
export interface OrderEmailData {
  orderId: string
  orderData: Order
  buyerEmail: string
  buyerName: string
  userEmail: string
  userDisplayName: string
  type: 'purchase' | 'reservation'
}