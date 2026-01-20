'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Anime } from '@/types/anime'
import { FiLock, FiStar, FiBookmark } from 'react-icons/fi'
import { cn } from '@/lib/utils'

interface AnimeCardProps {
  anime: Anime
  isAuthenticated?: boolean
  isInCollection?: boolean
}

export default function AnimeCard({
  anime,
  isAuthenticated = true,
  isInCollection = false,
}: AnimeCardProps) {
  if (!isAuthenticated) {
    return (
      <div
        className={cn(
          'group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg',
          'transition-all duration-300',
          'cursor-not-allowed'
        )}
      >
        <CardContent anime={anime} isAuthenticated={false} isInCollection={isInCollection} />
      </div>
    )
  }

  return (
    <Link
      href={anime.id ? `/anime/${anime.id}` : '#'}
      className={cn(
        'group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg',
        'transition-all duration-300 hover:shadow-2xl hover:-translate-y-2'
      )}
      onClick={(e) => {
        if (!anime.id) {
          e.preventDefault()
          console.error('Anime ID is missing:', anime)
        }
      }}
    >
      <CardContent anime={anime} isAuthenticated={true} isInCollection={isInCollection} />
    </Link>

  )
}

function CardContent({
  anime,
  isAuthenticated,
  isInCollection,
}: {
  anime: Anime
  isAuthenticated: boolean
  isInCollection: boolean
}) {
  return (
    <>
      {/* Anime Image */}
      <div className="aspect-[2/3] relative overflow-hidden bg-gray-200 dark:bg-gray-700">
        {anime.imageUrl && (
          <Image
            src={anime.imageUrl}
            alt={anime.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className={cn(
              'object-cover transition-transform duration-500',
              isAuthenticated && 'group-hover:scale-110'
            )}
          />
        )}

        {/* Lock Overlay if Not Authenticated */}
        {!isAuthenticated && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <div className="text-center">
              <FiLock className="w-12 h-12 text-white mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Sign in to view</p>
            </div>
          </div>
        )}

        {/* Collection Badge */}
        {isInCollection && (
          <div className="absolute top-2 right-2 bg-pink-600 text-white p-2 rounded-full shadow-lg z-10">
            <FiBookmark className="w-4 h-4 fill-current" />
          </div>
        )}

        {/* Score Badge */}
        {anime.score && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-lg text-sm font-bold flex items-center space-x-1 shadow-lg">
            <FiStar className="w-4 h-4 fill-current" />
            <span>{anime.score.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Anime Info */}
      <div className="p-4">
        <h3 className="font-bold text-base line-clamp-2 text-gray-900 dark:text-gray-100 mb-2 min-h-[3rem]">
          {anime.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{anime.year || 'N/A'}</span>
          {anime.episodes && (
            <span>{anime.episodes} eps</span>
          )}
        </div>
      </div>
    </>
  )
}
