<template>
  <v-card class="h-100 d-flex flex-column card-hover" elevation="2">
    <!-- Image -->
    <div class="position-relative">
      <v-img
        :src="car.images[0] || 'https://via.placeholder.com/400x250?text=No+Image'"
        :alt="`${car.brand} ${car.model}`"
        height="220"
        cover
        class="rounded-t-lg"
      />
      
      <!-- Status Badge -->
      <v-chip
        :color="statusColor"
        class="position-absolute top-4 left-4"
        size="small"
        variant="elevated"
      >
        {{ car.status }}
      </v-chip>
      
      <!-- Category Badge -->
      <v-chip
        color="primary"
        class="position-absolute top-4 right-4"
        size="small"
        variant="elevated"
      >
        {{ car.category }}
      </v-chip>
      
      <!-- Wishlist Button -->
      <v-btn
        icon
        size="small"
        variant="elevated"
        class="position-absolute bottom-4 right-4"
        :color="isWishlisted ? 'error' : 'white'"
        @click.prevent="toggleWishlist"
      >
        <v-icon :color="isWishlisted ? 'white' : 'grey'">
          {{ isWishlisted ? 'mdi-heart' : 'mdi-heart-outline' }}
        </v-icon>
      </v-btn>
    </div>
    
    <!-- Content -->
    <v-card-text class="flex-grow-1 pa-4">
      <div class="d-flex justify-space-between align-start mb-2">
        <div>
          <h3 class="text-h6 font-weight-bold">{{ car.brand }} {{ car.model }}</h3>
          <p class="text-body-2 text-grey-darken-1">{{ car.year }}</p>
        </div>
        <div class="text-right">
          <p class="text-h6 font-weight-bold text-primary">
            ${{ formatPrice(car.price) }}
          </p>
          <p v-if="car.originalPrice" class="text-caption text-decoration-line-through text-grey">
            ${{ formatPrice(car.originalPrice) }}
          </p>
        </div>
      </div>
      
      <!-- Features -->
      <div class="d-flex flex-wrap gap-2 mb-3">
        <v-chip size="x-small" variant="outlined" color="grey">
          <v-icon left size="14" class="mr-1">mdi-gas-station</v-icon>
          {{ car.fuelType }}
        </v-chip>
        <v-chip size="x-small" variant="outlined" color="grey">
          <v-icon left size="14" class="mr-1">mdi-car-shift-pattern</v-icon>
          {{ car.transmission }}
        </v-chip>
        <v-chip size="x-small" variant="outlined" color="grey">
          <v-icon left size="14" class="mr-1">mdi-gauge</v-icon>
          {{ formatMileage(car.mileage) }}
        </v-chip>
      </div>
      
      <p class="text-body-2 text-grey-darken-1 line-clamp-2">{{ car.description }}</p>
    </v-card-text>
    
    <!-- Actions -->
    <v-card-actions class="pa-4 pt-0">
      <v-btn
        :to="`/cars/${car.id}`"
        color="primary"
        variant="elevated"
        class="flex-grow-1 text-capitalize"
      >
        View Details
      </v-btn>
      
      <v-btn
        v-if="car.status === 'available'"
        :color="cartStore.isInCart(car.id) ? 'success' : 'secondary'"
        variant="outlined"
        class="text-capitalize"
        :disabled="cartStore.isInCart(car.id)"
        @click="addToCart"
      >
        <v-icon>
          {{ cartStore.isInCart(car.id) ? 'mdi-check' : 'mdi-cart-plus' }}
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import type { Car } from '@/types'

interface Props {
  car: Car
}

const props = defineProps<Props>()

const cartStore = useCartStore()
const isWishlisted = ref(false)

const statusColor = {
  available: 'success',
  reserved: 'warning',
  sold: 'error',
}[props.car.status] || 'grey'

const formatPrice = (price: number) => {
  return price.toLocaleString('en-US')
}

const formatMileage = (mileage: number) => {
  if (mileage >= 1000) {
    return `${(mileage / 1000).toFixed(1)}k mi`
  }
  return `${mileage} mi`
}

const toggleWishlist = () => {
  isWishlisted.value = !isWishlisted.value
}

const addToCart = () => {
  cartStore.addToCart(props.car)
}
</script>

<style scoped>
.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}

.top-4 {
  top: 16px;
}

.left-4 {
  left: 16px;
}

.right-4 {
  right: 16px;
}

.bottom-4 {
  bottom: 16px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gap-2 {
  gap: 8px;
}
</style>