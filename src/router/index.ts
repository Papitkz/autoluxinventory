import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/cars',
      name: 'cars',
      component: () => import('@/views/CarsView.vue')
    },
    {
      path: '/cars/:id',
      name: 'car-details',
      component: () => import('@/views/CarDetailsView.vue'),
      props: true
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true } // Added auth requirement
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('@/views/Services.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/Contact.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/ForgotPasswordView.vue'),
      meta: { guestOnly: true } // Only for guests
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/verify-email',
      name: 'VerifyEmail',
      component: () => import('@/views/VerifyEmailView.vue'),
      meta: { requiresAuth: true } // Only accessible when logged in but unverified
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/cars',
      name: 'admin-cars',
      component: () => import('@/views/AdminCarsView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/orders',
      name: 'admin-orders',
      component: () => import('@/views/AdminOrdersView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    // FIXED: Added comma before catch-all route
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

// Navigation guards with email verification
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Wait for auth initialization
  if (!authStore.initialized) {
    await authStore.initAuth()
  }
  
  const isAuthenticated = authStore.isAuthenticated
  const isAdmin = authStore.isAdmin
  const isEmailVerified = authStore.isEmailVerified
  
  // Check guest only routes (login, register, forgot-password)
  if (to.meta.guestOnly && isAuthenticated) {
    // If logged in but not verified, go to verification instead of home
    if (!isEmailVerified) {
      return next('/verify-email')
    }
    return next('/')
  }
  
  // Check authenticated routes
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }
  
  // Check if user is authenticated but email not verified
  // Allow access to verify-email page, but redirect other auth routes
  if (isAuthenticated && !isEmailVerified && to.path !== '/verify-email') {
    return next('/verify-email')
  }
  
  // If already verified and tries to access verify-email page, redirect home
  if (isAuthenticated && isEmailVerified && to.path === '/verify-email') {
    return next('/')
  }
  
  // Check admin routes
  if (to.meta.requiresAdmin && !isAdmin) {
    return next('/')
  }
  
  next()
})

export default router