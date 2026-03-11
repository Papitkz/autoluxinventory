import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  sendEmailVerification,
  reload,
  sendPasswordResetEmail
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { auth, db, storage } from '@/firebase/config'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const initialized = ref(false)
  const emailVerificationSent = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const currentUser = computed(() => user.value)
  const isEmailVerified = computed(() => auth.currentUser?.emailVerified ?? false)

  // Initialize auth state listener
  const initAuth = () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // Reload to get latest emailVerified status
          await reload(firebaseUser)
          
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            user.value = { 
              ...userData, 
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || userData.displayName,
              photoURL: firebaseUser.photoURL || userData.photoURL,
              emailVerified: firebaseUser.emailVerified,
              phone: userData.phone || '',
              address: userData.address || ''
            }
          } else {
            // Create user doc if doesn't exist (for Google sign-in)
            const userData = {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              phone: '',
              address: '',
              role: 'user',
              emailVerified: firebaseUser.emailVerified,
              createdAt: serverTimestamp()
            }
            await setDoc(doc(db, 'users', firebaseUser.uid), userData)
            user.value = { ...userData, uid: firebaseUser.uid }
          }
        } else {
          user.value = null
        }
        initialized.value = true
        resolve()
      })
    })
  }

  // Register with email verification
  const register = async (email, password, displayName, isAdmin = false) => {
    loading.value = true
    error.value = null
    
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)
      
      await firebaseUpdateProfile(firebaseUser, { displayName })
      
      // Send email verification
      await sendEmailVerification(firebaseUser, {
        url: `${window.location.origin}/login?verified=true`,
        handleCodeInApp: false
      })
      
      emailVerificationSent.value = true
      
      const userData = {
        email,
        displayName,
        photoURL: null,
        phone: '',
        address: '',
        role: isAdmin ? 'admin' : 'user',
        emailVerified: false,
        createdAt: new Date()
      }
      
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        createdAt: serverTimestamp()
      })
      
      user.value = { ...userData, uid: firebaseUser.uid }
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Resend verification email
  const resendVerificationEmail = async () => {
    if (!auth.currentUser) {
      error.value = 'No user logged in'
      return false
    }
    
    loading.value = true
    error.value = null
    
    try {
      await sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/login?verified=true`,
        handleCodeInApp: false
      })
      emailVerificationSent.value = true
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Check if email is verified and update Firestore
  const checkEmailVerified = async () => {
    if (!auth.currentUser) return false
    
    await reload(auth.currentUser)
    
    if (auth.currentUser.emailVerified && user.value) {
      // Update Firestore
      await updateDoc(doc(db, 'users', user.value.uid), {
        emailVerified: true,
        updatedAt: serverTimestamp()
      })
      
      // Update local state
      user.value.emailVerified = true
      return true
    }
    
    return false
  }

  // Login
  const login = async (email, password) => {
    loading.value = true
    error.value = null
    
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password)
      
      // Reload to get latest emailVerified status
      await reload(firebaseUser)
      
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        user.value = { 
          ...userData, 
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || userData.displayName,
          photoURL: firebaseUser.photoURL || userData.photoURL,
          emailVerified: firebaseUser.emailVerified,
          phone: userData.phone || '',
          address: userData.address || ''
        }
      }
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Google login
  const loginWithGoogle = async () => {
    loading.value = true
    error.value = null
    
    try {
      const provider = new GoogleAuthProvider()
      const { user: firebaseUser } = await signInWithPopup(auth, provider)
      
      const userDocRef = doc(db, 'users', firebaseUser.uid)
      const userDoc = await getDoc(userDocRef)
      
      if (!userDoc.exists()) {
        const userData = {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          phone: '',
          address: '',
          role: 'user',
          emailVerified: firebaseUser.emailVerified, // Google accounts are pre-verified
          createdAt: serverTimestamp()
        }
        await setDoc(userDocRef, userData)
        user.value = { ...userData, uid: firebaseUser.uid }
      } else {
        const userData = userDoc.data()
        user.value = { 
          ...userData, 
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || userData.displayName,
          photoURL: firebaseUser.photoURL || userData.photoURL,
          emailVerified: firebaseUser.emailVerified,
          phone: userData.phone || '',
          address: userData.address || ''
        }
        
        // Update verification status if changed
        if (userData.emailVerified !== firebaseUser.emailVerified) {
          await updateDoc(userDocRef, { emailVerified: firebaseUser.emailVerified })
        }
      }
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Forgot password
  const forgotPassword = async (email) => {
    loading.value = true
    error.value = null
    
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/login`, // Redirect back to login after reset
        handleCodeInApp: false
      })
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Update user profile
  const updateUserProfile = async (profileData) => {
    if (!auth.currentUser || !user.value) {
      error.value = 'No user logged in'
      return false
    }

    loading.value = true
    error.value = null

    try {
      // Update Firebase Auth profile (displayName and photoURL only)
      if (profileData.displayName !== undefined || profileData.photoURL !== undefined) {
        await firebaseUpdateProfile(auth.currentUser, {
          displayName: profileData.displayName || user.value.displayName,
          photoURL: profileData.photoURL !== undefined ? profileData.photoURL : user.value.photoURL
        })
      }

      // Update Firestore user document (all fields including phone and address)
      const userRef = doc(db, 'users', user.value.uid)
      const updateData = {}
      
      if (profileData.displayName !== undefined) updateData.displayName = profileData.displayName
      if (profileData.photoURL !== undefined) updateData.photoURL = profileData.photoURL
      if (profileData.phone !== undefined) updateData.phone = profileData.phone
      if (profileData.address !== undefined) updateData.address = profileData.address
      
      updateData.updatedAt = serverTimestamp()

      await updateDoc(userRef, updateData)

      // Update local state
      user.value = {
        ...user.value,
        ...updateData,
        updatedAt: new Date()
      }

      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Upload profile image
  const uploadProfileImage = async (file) => {
    if (!auth.currentUser || !user.value) {
      error.value = 'No user logged in'
      return null
    }

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image')
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image must be less than 5MB')
      }

      // Create storage reference
      const imageRef = storageRef(storage, `profile-images/${user.value.uid}`)
      
      // Upload file
      await uploadBytes(imageRef, file)
      
      // Get download URL
      const downloadURL = await getDownloadURL(imageRef)
      
      return downloadURL
    } catch (err) {
      error.value = err.message
      return null
    }
  }

  // Delete old profile image
  const deleteProfileImage = async () => {
    if (!user.value?.uid) return
    
    try {
      const imageRef = storageRef(storage, `profile-images/${user.value.uid}`)
      await deleteObject(imageRef)
    } catch (err) {
      // Image might not exist, ignore error
    }
  }

  // Update user password
  const updateUserPassword = async (currentPassword, newPassword) => {
    if (!auth.currentUser || !auth.currentUser.email) {
      error.value = 'No user logged in'
      return false
    }

    loading.value = true
    error.value = null

    try {
      // Reauthenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      )
      await reauthenticateWithCredential(auth.currentUser, credential)

      // Update password
      await updatePassword(auth.currentUser, newPassword)

      return true
    } catch (err) {
      if (err.code === 'auth/wrong-password') {
        error.value = 'Current password is incorrect'
      } else if (err.code === 'auth/weak-password') {
        error.value = 'New password is too weak'
      } else {
        error.value = err.message
      }
      return false
    } finally {
      loading.value = false
    }
  }

  // Delete user account
  const deleteAccount = async () => {
    if (!auth.currentUser || !user.value) {
      error.value = 'No user logged in'
      return false
    }

    loading.value = true
    error.value = null

    try {
      // Delete user data from Firestore
      await deleteDoc(doc(db, 'users', user.value.uid))
      
      // Delete profile image if exists
      await deleteProfileImage()
      
      // Delete user authentication
      await deleteUser(auth.currentUser)
      
      user.value = null
      return true
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        error.value = 'Please re-login before deleting your account'
      } else {
        error.value = err.message
      }
      return false
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = async () => {
    try {
      await signOut(auth)
      user.value = null
      emailVerificationSent.value = false
      return true
    } catch (err) {
      error.value = err.message
      return false
    }
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  return {
    user,
    loading,
    error,
    initialized,
    emailVerificationSent,
    isAuthenticated,
    isAdmin,
    isEmailVerified,
    currentUser,
    initAuth,
    register,
    resendVerificationEmail,
    checkEmailVerified,
    login,
    loginWithGoogle,
    forgotPassword,
    updateUserProfile,
    uploadProfileImage,
    deleteProfileImage,
    updateUserPassword,
    deleteAccount,
    logout,
    clearError
  }
})