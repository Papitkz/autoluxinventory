<template>
  <v-card class="d-flex flex-column flex-sm-row" elevation="2">
    <!-- Image -->
    <v-img
      :src="car.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'"
      :alt="`${car.brand} ${car.model}`"
      width="300"
      height="200"
      cover
      class="rounded-l-lg"
    />
    
    <!-- Content -->
    <div class="flex-grow-1 pa-4 d-flex flex-column">
      <div class="d-flex justify-space-between align-start mb-2">
        <div>
          <div class="d-flex align-center gap-2 mb-1">
            <v-chip
              :color="statusColor"
              size="x-small"
              variant="elevated"
            >
              {{ car.status }}
            </v-chip>
            <v-chip
              color="primary"
              size="x-small"
              variant="outlined"
            >
              {{ car.category }}
            </v-chip>
          </div>
          <h3 class="text-h5 font-weight-bold">{{ car.brand }} {{ car.model }}</h3>
          <p class="text-body-1 text-grey-darken-1">{{ car.year }}</p>
        </div>
        <div class="text-right">
          <p class="text-h5 font-weight-bold text-primary">
            ${{ formatPrice(car.price) }}
          </p>
          <p v-if="car.originalPrice" class="text-caption text-decoration-line-through text-grey">
            ${{ formatPrice(car.originalPrice) }}
          </p>
        </div>
      </div>
      
      <!-- Specs -->
      <div class="d-flex flex-wrap gap-3 mb-3">
        <div class="d-flex align-center">
          <v-icon icon="mdi-gas-station" size="18" color="grey" class="mr-1" />
          <span class="text-body-2">{{ car.fuelType }}</span>
        </div>
        <div class="d-flex align-center">
          <v-icon icon="mdi-car-shift-pattern" size="18" color="grey" class="mr-1" />
          <span class="text-body-2">{{ car.transmission }}</span>
        </div>
        <div class="d-flex align-center">
          <v-icon icon="mdi-gauge" size="18" color="grey" class="mr-1" />
          <span class="text-body-2">{{ formatMileage(car.mileage) }}</span>
        </div>
        <div class="d-flex align-center">
          <v-icon icon="mdi-palette" size="18" color="grey" class="mr-1" />
          <span class="text-body-2">{{ car.color }}</span>
        </div>
      </div>
      
      <p class="text-body-2 text-grey-darken-1 line-clamp-2 mb-3 flex-grow-1">
        {{ car.description }}
      </p>
      
      <!-- Features -->
      <div class="d-flex flex-wrap gap-2 mb-3">
        <v-chip
          v-for="feature in displayedFeatures"
          :key="feature"
          size="x-small"
          variant="outlined"
          color="grey"
        >
          {{ feature }}
        </v-chip>
        <v-chip
          v-if="car.features.length > 3"
          size="x-small"
          variant="outlined"
          color="primary"
        >
          +{{ car.features.length - 3 }} more
        </v-chip>
      </div>
      
      <!-- Actions -->
      <div class="d-flex gap-2 mt-auto">
        <v-btn
          :to="`/cars/${car.id}`"
          color="primary"
          variant="elevated"
          class="text-capitalize"
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
          <v-icon left class="mr-2">
            {{ cartStore.isInCart(car.id) ? 'mdi-check' : 'mdi-cart-plus' }}
          </v-icon>
          {{ cartStore.isInCart(car.id) ? 'In Cart' : 'Add to Cart' }}
        </v-btn>
        
        <v-spacer />
        
        <v-btn
          icon
          variant="text"
          :color="isWishlisted ? 'error' : 'grey'"
          @click="toggleWishlist"
        >
          <v-icon>{{ isWishlisted ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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

const displayedFeatures = computed(() => props.car.features.slice(0, 3))

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
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}
</style>