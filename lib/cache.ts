import { prisma } from './prisma'
import { fetchAnimeFromJikan } from './jikan'

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000

export async function getCachedAnime(animeId: number) {
  const cached = await prisma.anime.findUnique({
    where: { id: animeId },
  })

  const isFresh =
    cached &&
    new Date().getTime() - cached.lastFetched.getTime() < CACHE_DURATION

  if (isFresh) {
    return cached
  }

  const jikanData = await fetchAnimeFromJikan(animeId)

  const anime = await prisma.anime.upsert({
    where: { id: animeId },
    create: {
      id: jikanData.mal_id,
      title: jikanData.title,
      titleEnglish: jikanData.title_english,
      synopsis: jikanData.synopsis,
      imageUrl: jikanData.images?.jpg?.large_image_url || jikanData.images?.jpg?.image_url,
      trailerUrl: jikanData.trailer?.embed_url || jikanData.trailer?.url,
      score: jikanData.score,
      episodes: jikanData.episodes,
      status: jikanData.status,
      rating: jikanData.rating,
      year: jikanData.year,
      season: jikanData.season,
      genres: JSON.stringify(jikanData.genres || []),
    },
    update: {
      title: jikanData.title,
      titleEnglish: jikanData.title_english,
      synopsis: jikanData.synopsis,
      imageUrl: jikanData.images?.jpg?.large_image_url || jikanData.images?.jpg?.image_url,
      trailerUrl: jikanData.trailer?.embed_url || jikanData.trailer?.url,
      score: jikanData.score,
      episodes: jikanData.episodes,
      status: jikanData.status,
      rating: jikanData.rating,
      year: jikanData.year,
      season: jikanData.season,
      genres: JSON.stringify(jikanData.genres || []),
      lastFetched: new Date(),
    },
  })

  return anime
}
