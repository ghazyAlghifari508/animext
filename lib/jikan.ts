import pLimit from 'p-limit'

const limit = pLimit(3)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const JIKAN_API_URL = process.env.JIKAN_API_URL || 'https://api.jikan.moe/v4'

export interface JikanAnime {
  mal_id: number
  title: string
  title_english?: string
  synopsis?: string
  images?: {
    jpg?: {
      large_image_url?: string
      image_url?: string
    }
  }
  trailer?: {
    url?: string
    youtube_id?: string
    embed_url?: string
  }
  score?: number
  episodes?: number
  status?: string
  rating?: string
  year?: number
  season?: string
  genres?: Array<{ mal_id: number; name: string }>
}

export interface JikanResponse<T> {
  data: T
  pagination?: {
    last_visible_page: number
    has_next_page: boolean
    current_page: number
  }
}

export async function fetchAnimeFromJikan(animeId: number): Promise<JikanAnime> {
  return limit(async () => {
    try {
      const res = await fetch(`${JIKAN_API_URL}/anime/${animeId}`, {
        next: { revalidate: 86400 }
      })
      
      if (res.status === 429) {
        await delay(1000)
        return fetchAnimeFromJikan(animeId)
      }
      
      if (!res.ok) {
        throw new Error(`Jikan API error: ${res.status}`)
      }
      
      const data: JikanResponse<JikanAnime> = await res.json()
      return data.data
    } catch (error) {
      console.error('Failed to fetch from Jikan API:', error)
      throw error
    }
  })
}

export async function fetchTopAnime(page = 1): Promise<JikanResponse<JikanAnime[]>> {
  return limit(async () => {
    try {
      const res = await fetch(`${JIKAN_API_URL}/top/anime?page=${page}`, {
        next: { revalidate: 3600 }
      })
      
      if (res.status === 429) {
        await delay(1000)
        return fetchTopAnime(page)
      }
      
      if (!res.ok) {
        throw new Error(`Jikan API error: ${res.status}`)
      }
      
      return await res.json()
    } catch (error) {
      console.error('Failed to fetch top anime:', error)
      throw error
    }
  })
}

export async function searchAnime(query: string, page = 1): Promise<JikanResponse<JikanAnime[]>> {
  return limit(async () => {
    try {
      const res = await fetch(
        `${JIKAN_API_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=20`,
        {
          next: { revalidate: 3600 }
        }
      )
      
      if (res.status === 429) {
        await delay(1000)
        return searchAnime(query, page)
      }
      
      if (!res.ok) {
        throw new Error(`Jikan API error: ${res.status}`)
      }
      
      return await res.json()
    } catch (error) {
      console.error('Failed to search anime:', error)
      throw error
    }
  })
}

export async function fetchSeasonalAnime(year?: number, season?: string): Promise<JikanResponse<JikanAnime[]>> {
  const currentYear = year || new Date().getFullYear()
  const currentSeason = season || getCurrentSeason()
  
  return limit(async () => {
    try {
      const res = await fetch(
        `${JIKAN_API_URL}/seasons/${currentYear}/${currentSeason}`,
        {
          next: { revalidate: 3600 }
        }
      )
      
      if (res.status === 429) {
        await delay(1000)
        return fetchSeasonalAnime(year, season)
      }
      
      if (!res.ok) {
        throw new Error(`Jikan API error: ${res.status}`)
      }
      
      return await res.json()
    } catch (error) {
      console.error('Failed to fetch seasonal anime:', error)
      throw error
    }
  })
}

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1
  if (month >= 1 && month <= 3) return 'winter'
  if (month >= 4 && month <= 6) return 'spring'
  if (month >= 7 && month <= 9) return 'summer'
  return 'fall'
}

export async function fetchAnimeRecommendations(id: number): Promise<JikanAnime[]> {
  return limit(async () => {
    try {
      const res = await fetch(`${JIKAN_API_URL}/anime/${id}/recommendations`, {
        next: { revalidate: 86400 }
      })
      
      if (res.status === 429) {
        await delay(1000)
        return fetchAnimeRecommendations(id)
      }
      
      if (!res.ok) {
        throw new Error(`Jikan API error: ${res.status}`)
      }
      
      const data = await res.json()
      return data.data.map((item: any) => item.entry).slice(0, 3) 
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
      return []
    }
  })
}
