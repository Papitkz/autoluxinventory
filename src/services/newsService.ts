// src/services/newsService.ts
const API_KEY = '17ff3d2b1de342b59045482ee7a11ee8' // Replace with your key
const BASE_URL = 'https://newsapi.org/v2'

export interface NewsArticle {
  title: string
  description: string
  url: string
  urlToImage: string | null
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

export const fetchCarNews = async (pageSize: number = 5): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/everything?q=cars+automotive+luxury+vehicles&` +
      `sortBy=publishedAt&` +
      `language=en&` +
      `pageSize=${pageSize}&` +
      `apiKey=${API_KEY}`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data: NewsResponse = await response.json()
    
    // Filter out articles without images for better UI
    return data.articles.filter(article => 
      article.urlToImage && 
      article.title !== '[Removed]' &&
      article.description
    )
  } catch (error) {
    console.error('Error fetching car news:', error)
    return []
  }
}

// Alternative: Use GNews (better image quality, fewer restrictions)
export const fetchCarNewsGNews = async (pageSize: number = 5): Promise<NewsArticle[]> => {
  const GNEWS_API_KEY = 'YOUR_GNEWS_KEY'
  
  try {
    const response = await fetch(
      `https://gnews.io/api/v4/search?q=luxury+cars+automotive&` +
      `lang=en&` +
      `country=us&` +
      `max=${pageSize}&` +
      `apikey=${GNEWS_API_KEY}`
    )
    
    const data = await response.json()
    
    return data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.image,
      publishedAt: article.publishedAt,
      source: { name: article.source.name }
    }))
  } catch (error) {
    console.error('Error fetching from GNews:', error)
    return []
  }
}