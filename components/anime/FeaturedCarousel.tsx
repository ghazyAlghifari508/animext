import { fetchTopAnime } from '@/lib/jikan'
import AnimeCarousel from './AnimeCarousel'

interface FeaturedCarouselProps {
  isAuthenticated: boolean
}

export default async function FeaturedCarousel({ isAuthenticated }: FeaturedCarouselProps) {
  const data = await fetchTopAnime(1)
  
  // Get top 5 anime for carousel
  const featuredAnime = data.data.slice(0, 5).map((anime) => ({
    id: anime.mal_id,
    title: anime.title,
    titleEnglish: anime.title_english || null,
    synopsis: anime.synopsis || null,
    imageUrl: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || null,
    trailerUrl: anime.trailer?.embed_url || anime.trailer?.url || null,
    score: anime.score || null,
    episodes: anime.episodes || null,
    status: anime.status || null,
    rating: anime.rating || null,
    year: anime.year || null,
    season: anime.season || null,
    genres: JSON.stringify(anime.genres || []),
    lastFetched: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }))

  return <AnimeCarousel anime={featuredAnime} isAuthenticated={isAuthenticated} />
}
