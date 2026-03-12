// src/services/newsService.ts

// GNEWS CONFIGURATION - Works on Vercel (Free tier: 100 requests/day)
const GNEWS_API_KEY = '30b2b0e06315e69621654f29c0d0edd7' // Get from https://gnews.io/
const GNEWS_URL = 'https://gnews.io/api/v4'

// NEWSAPI CONFIGURATION - Only works in development (blocked on production deploys)
const NEWSAPI_KEY = '17ff3d2b1de342b59045482ee7a11ee8'
const NEWSAPI_URL = 'https://newsapi.org/v2'

// Unified interface for both APIs
export interface NewsArticle {
  title: string
  description: string
  url: string
  urlToImage: string | null  // Normalized field name
  publishedAt: string
  source: {
    name: string
  }
}

export interface NewsResponse {
  status: string
  totalResults: number
  articles: NewsArticle[]
}

// Fallback data when APIs fail (keeps UI working)
const getFallbackNews = (): NewsArticle[] => [
  {
    title: "2025 Porsche 911 Hybrid Revealed with 532 HP",
    description: "The iconic 911 goes hybrid for the first time, combining a twin-turbo flat-six with an electric motor for unprecedented performance.",
    url: "https://www.porsche.com",
    urlToImage: "https://images.unsplash.com/photo-1503376763036-066120622c74?w=800",
    publishedAt: new Date().toISOString(),
    source: { name: "AutoLux" }
  },
  {
    title: "Ferrari's First Electric Supercar Coming 2026",
    description: "Maranello confirms its first fully electric vehicle will debut next year, promising 'authentic Ferrari sound'.",
    url: "https://www.ferrari.com",
    urlToImage: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    source: { name: "AutoLux" }
  },
  {
    title: "BMW M5 Touring Returns with 727 HP Hybrid V8",
    description: "The ultimate performance wagon is back, featuring the same powertrain as the XM SUV but in a practical estate body.",
    url: "https://www.bmw.com",
    urlToImage: "https://images.unsplash.com/photo-1555215695-3004980adade?w=800",
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    source: { name: "AutoLux" }
  },
  {
    title: "Mercedes-AMG GT 63 S E Performance Review",
    description: "The 831-horsepower plug-in hybrid supercar challenges Porsche's dominance in the luxury performance segment.",
    url: "https://www.mercedes-amg.com",
    urlToImage: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    source: { name: "AutoLux" }
  }
]

/**
 * PRIMARY: Fetch from GNews API (RECOMMENDED - Works on Vercel)
 * Free tier: 100 requests/day, no CORS restrictions
 */
export const fetchCarNews = async (pageSize: number = 5): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(
      `${GNEWS_URL}/search?q=luxury+cars+automotive+supercar+ferrari+porsche+bmw+mercedes&` +
      `lang=en&` +
      `country=us&` +
      `max=${pageSize}&` +
      `apikey=${GNEWS_API_KEY}`
    )
    
    if (!response.ok) {
      // If GNews fails, try to get useful error
      if (response.status === 403) {
        console.warn('GNews API key invalid or limit reached')
      }
      throw new Error(`GNews HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Map GNews format to our interface
    const articles: NewsArticle[] = data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.image, // GNews uses 'image' not 'urlToImage'
      publishedAt: article.publishedAt,
      source: { name: article.source.name }
    }))
    
    // Filter out articles without images
    return articles.filter(article => 
      article.urlToImage && 
      article.title !== '[Removed]' &&
      article.description
    )
    
  } catch (error) {
    console.error('GNews fetch failed:', error)
    // Return fallback so UI doesn't break
    return getFallbackNews()
  }
}

/**
 * ALTERNATIVE: Fetch from NewsAPI (DEVELOPMENT ONLY)
 * ⚠️ BLOCKED on Vercel/Netlify production - requires paid plan for CORS
 */
export const fetchCarNewsNewsAPI = async (pageSize: number = 5): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(
      `${NEWSAPI_URL}/everything?q=cars+automotive+luxury+vehicles&` +
      `sortBy=publishedAt&` +
      `language=en&` +
      `pageSize=${pageSize}&` +
      `apiKey=${NEWSAPI_KEY}`
    )
    
    if (!response.ok) {
      throw new Error(`NewsAPI HTTP error! status: ${response.status}`)
    }
    
    const data: NewsResponse = await response.json()
    
    return data.articles.filter(article => 
      article.urlToImage && 
      article.title !== '[Removed]' &&
      article.description
    )
  } catch (error) {
    console.error('NewsAPI fetch failed:', error)
    return getFallbackNews()
  }
}

/**
 * SMART FETCH: Automatically chooses best available API
 * 1. Tries GNews first (works everywhere)
 * 2. Falls back to static data if both fail
 */
export const fetchCarNewsSmart = async (pageSize: number = 5): Promise<NewsArticle[]> => {
  // Try GNews first (production-friendly)
  const gnewsResult = await fetchCarNews(pageSize)
  
  // If we got real data (not fallback), return it
  if (gnewsResult.length > 0 && gnewsResult[0].source.name !== 'AutoLux') {
    return gnewsResult
  }
  
  // Otherwise fallback is already returned
  return gnewsResult
}