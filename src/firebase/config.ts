import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJYrxcBwxXO5a8VA_K4ONm2GCrt2DeaFE",
  authDomain: "autolux-cars.firebaseapp.com",
  projectId: "autolux-cars",
  storageBucket: "autolux-cars.firebasestorage.app",
  messagingSenderId: "818709333429",
  appId: "1:818709333429:web:ff053389fefa6099a405fc",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)

// Connect to Functions emulator in development
if (process.env.NODE_ENV === 'development') {
  // Uncomment the line below to use local emulator during development
  // connectFunctionsEmulator(functions, "localhost", 5001)
}

export default app