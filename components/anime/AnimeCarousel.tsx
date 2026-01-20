'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Anime } from '@/types/anime'

interface AnimeCarouselProps {
  anime: Anime[]
  isAuthenticated: boolean
}

export default function AnimeCarousel({ anime, isAuthenticated }: AnimeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % anime.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [anime.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + anime.length) % anime.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % anime.length)
  }

  if (anime.length === 0) return null

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-gray-900 group">
      {/* Slides Container */}
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out will-change-transform"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {anime.map((currentAnime, index) => (
          <div key={`${currentAnime.id}-${index}`} className="relative w-full h-full flex-shrink-0">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              {currentAnime.imageUrl && (
                <>
                  <Image
                    src={currentAnime.imageUrl}
                    alt={currentAnime.title}
                    fill
                    className="object-cover opacity-40 blur-sm scale-110"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                </>
              )}
            </div>

            {/* Content */}
            <div className="relative h-full container mx-auto px-4 flex items-center">
              <div className="grid md:grid-cols-2 gap-8 items-center w-full">
                {/* Text Content */}
                <div className="text-white space-y-6 max-w-2xl">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-600/90 backdrop-blur-sm rounded-full text-sm font-medium border border-indigo-500/50 shadow-lg shadow-indigo-500/20">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>Featured Anime</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight drop-shadow-2xl">
                    {currentAnime.title}
                  </h1>

                  {currentAnime.synopsis && (
                    <p className="text-lg text-gray-300 line-clamp-3 leading-relaxed drop-shadow-md">
                      {currentAnime.synopsis}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                    {currentAnime.score && (
                      <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1.5 rounded-lg border border-yellow-500/50 backdrop-blur-sm text-yellow-400">
                        <span className="text-lg font-bold">★ {currentAnime.score.toFixed(1)}</span>
                      </div>
                    )}
                    {currentAnime.year && (
                      <span className="px-3 py-1.5 bg-white/10 rounded-lg border border-white/10 backdrop-blur-sm">
                        {currentAnime.year}
                      </span>
                    )}
                    {currentAnime.episodes && (
                      <span className="px-3 py-1.5 bg-white/10 rounded-lg border border-white/10 backdrop-blur-sm">
                        {currentAnime.episodes} Episodes
                      </span>
                    )}
                    {currentAnime.status && (
                      <span className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30 backdrop-blur-sm uppercase tracking-wide text-xs">
                        {currentAnime.status}
                      </span>
                    )}
                  </div>

                  {isAuthenticated && currentAnime.id && (
                    <Link
                      href={`/anime/${currentAnime.id}`}
                      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 group/btn"
                    >
                      <span>View Details</span>
                      <FiChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>

                {/* Anime Poster */}
                <div className="hidden md:block">
                  {currentAnime.imageUrl && (
                    <div className="relative w-full max-w-sm mx-auto perspective-1000">
                      <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-indigo-500/20 transform transition-transform hover:scale-105 duration-500 border border-white/10">
                        <Image
                          src={currentAnime.imageUrl}
                          alt={currentAnime.title}
                          width={400}
                          height={600}
                          className="object-cover"
                          priority={index === 0}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={goToPrevious}
          className="bg-black/30 hover:bg-black/60 text-white p-4 rounded-full backdrop-blur-md border border-white/10 transition-all hover:scale-110 active:scale-95"
          aria-label="Previous anime"
        >
          <FiChevronLeft className="w-8 h-8" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center pr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={goToNext}
          className="bg-black/30 hover:bg-black/60 text-white p-4 rounded-full backdrop-blur-md border border-white/10 transition-all hover:scale-110 active:scale-95"
          aria-label="Next anime"
        >
          <FiChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {anime.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-indigo-500 w-8 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                : 'bg-white/30 w-2 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

