// src/stores/news.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchCarNews, type NewsArticle } from '@/services/newsService'

export const useNewsStore = defineStore('news', () => {
  const articles = ref<NewsArticle[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetched = ref<Date | null>(null)

  const featuredArticle = computed(() => articles.value[0] || null)
  const sideArticles = computed(() => articles.value.slice(1, 4) || [])

  const fetchNews = async (forceRefresh: boolean = false) => {
    // Cache for 15 minutes to avoid API limits
    if (!forceRefresh && lastFetched.value) {
      const minutesSinceLastFetch = (Date.now() - lastFetched.value.getTime()) / 1000 / 60
      if (minutesSinceLastFetch < 15) return
    }

    loading.value = true
    error.value = null

    try {
      const news = await fetchCarNews(5)
      articles.value = news
      lastFetched.value = new Date()
    } catch (err) {
      error.value = 'Failed to load news'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const formatPublishedDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return {
    articles,
    loading,
    error,
    featuredArticle,
    sideArticles,
    fetchNews,
    formatPublishedDate
  }
})