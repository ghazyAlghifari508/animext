import { fetchTopAnime } from '@/lib/jikan'
import AnimeCard from './AnimeCard'
import PaginationWrapper from '@/app/collection/PaginationWrapper'

interface TopAnimeSectionProps {
  isAuthenticated: boolean
  page?: number
}

export default async function TopAnimeSection({ isAuthenticated, page = 1 }: TopAnimeSectionProps) {
  const data = await fetchTopAnime(page)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data.data.map((anime, index) => (
          <AnimeCard
            key={`${anime.mal_id}-${index}`}
            anime={{
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
            }}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>

      {data.pagination && data.pagination.last_visible_page > 1 && (
        <PaginationWrapper 
          currentPage={page}
          totalPages={data.pagination.last_visible_page}
          basePath="/"
        />
      )}
    </div>
  )
}

