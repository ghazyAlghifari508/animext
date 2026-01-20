import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCachedAnime } from '@/lib/cache'
import { prisma } from '@/lib/prisma'
import Container from '@/components/layout/Container'
import { parseGenres } from '@/lib/utils'
import Image from 'next/image'
import { FiCalendar, FiStar, FiTv } from 'react-icons/fi'
import CollectionButton from '@/components/collection/CollectionButton'
import CommentSection from '@/components/comments/CommentSection'
import RecommendationsSection from '@/components/anime/RecommendationsSection'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const animeId = parseInt(id)
  
  if (isNaN(animeId)) return { title: 'Anime List' }

  const anime = await getCachedAnime(animeId)
  
  return {
    title: `${anime.title} - AnimeList`,
    description: anime.synopsis || `Watch and collect ${anime.title}`,
  }
}

export default async function AnimeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  const animeId = parseInt(id)

  if (isNaN(animeId)) {
    notFound()
  }


  const anime = await getCachedAnime(animeId)

  if (!anime) {
    notFound()
  }

  // Check if in user's collection
  let isInCollection = false
  if (session?.user?.id) {
    const collection = await prisma.collection.findUnique({
      where: {
        userId_animeId: {
          userId: session.user.id,
          animeId,
        },
      },
    })
    isInCollection = !!collection
  }

  const genres = parseGenres(anime.genres)

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Container className="py-12">
          <div className="grid md:grid-cols-[300px_1fr] gap-8">
            {/* Anime Poster */}
            <div className="mx-auto md:mx-0">
              {anime.imageUrl && (
                <Image
                  src={anime.imageUrl}
                  alt={anime.title}
                  width={300}
                  height={450}
                  className="rounded-xl shadow-2xl"
                  priority
                />
              )}
            </div>

            {/* Anime Info */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{anime.title}</h1>
              {anime.titleEnglish && anime.titleEnglish !== anime.title && (
                <p className="text-xl text-gray-300 mb-4">{anime.titleEnglish}</p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 mb-6 text-sm">
                {anime.score && (
                  <div className="flex items-center space-x-2">
                    <FiStar className="w-5 h-5 text-yellow-400" />
                    <span className="font-semibold text-lg">{anime.score.toFixed(1)}</span>
                  </div>
                )}
                {anime.year && (
                  <div className="flex items-center space-x-2">
                    <FiCalendar className="w-5 h-5" />
                    <span>{anime.year}</span>
                  </div>
                )}
                {anime.episodes && (
                  <div className="flex items-center space-x-2">
                    <FiTv className="w-5 h-5" />
                    <span>{anime.episodes} episodes</span>
                  </div>
                )}
                {anime.status && (
                  <div className="px-3 py-1 bg-indigo-600 rounded-full">
                    {anime.status}
                  </div>
                )}
              </div>

              {/* Genres */}
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {genres.map((genre, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Synopsis */}
              {anime.synopsis && (
                <p className="text-gray-300 leading-relaxed mb-6">{anime.synopsis}</p>
              )}

              {/* Collection Button */}
              <CollectionButton animeId={animeId} initialInCollection={isInCollection} />
            </div>
          </div>
        </Container>
      </div>

      {/* Trailer Section */}
      {anime.trailerUrl && (
        <Container className="py-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Trailer
          </h2>
          <div className="aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-800 bg-black">
            <iframe
              src={anime.trailerUrl.replace('youtube.com', 'youtube-nocookie.com').replace('autoplay=1', 'autoplay=0')}
              title={`${anime.title} Trailer`}
              className="w-full h-full"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

        </Container>
      )}

      {/* Recommendations Section */}
      <RecommendationsSection animeId={animeId} />

      {/* Comments Section */}
      <Container className="py-8">
        <CommentSection animeId={animeId} />
      </Container>
    </div>
  )
}
