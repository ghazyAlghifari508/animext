import { fetchAnimeRecommendations } from '@/lib/jikan'
import Link from 'next/link'
import Image from 'next/image'
import Container from '@/components/layout/Container'

export default async function RecommendationsSection({ animeId }: { animeId: number }) {
  const recommendations = await fetchAnimeRecommendations(animeId)

  if (recommendations.length === 0) return null

  return (
    <Container className="py-8 border-t border-gray-100 dark:border-gray-800">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {recommendations.map((anime) => (
          <Link 
            key={anime.mal_id} 
            href={`/anime/${anime.mal_id}`}
            className="group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
               {anime.images?.jpg?.large_image_url ? (
                  <Image 
                    src={anime.images.jpg.large_image_url} 
                    alt={anime.title} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
               ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-indigo-500 transition-colors">
                {anime.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  )
}
