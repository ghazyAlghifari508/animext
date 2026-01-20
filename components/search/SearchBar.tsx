'use client'

import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import Input from '../ui/Input'
import { FiSearch, FiX } from 'react-icons/fi'
import useSWR from 'swr'
import Link from 'next/link'
import Image from 'next/image'
import { AnimeCardSkeleton } from '../ui/Skeleton'

interface SearchBarProps {
  onClose?: () => void
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)

  const { data, isLoading } = useSWR(
    debouncedQuery ? `/api/anime/search?q=${debouncedQuery}` : null,
    fetcher
  )

  return (
    <div className="relative">
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search anime..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
          autoFocus
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              onClose?.()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {debouncedQuery && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex space-x-3">
                  <div className="w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : data && data.results && data.results.length > 0 ? (
            <div className="p-2">
              {data.results.slice(0, 8).map((anime: any) => (
                <Link
                  key={anime.id}
                  href={`/anime/${anime.id}`}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    setQuery('')
                    onClose?.()
                  }}
                >
                  {anime.imageUrl && (
                    <Image
                      src={anime.imageUrl}
                      alt={anime.title}
                      width={48}
                      height={64}
                      className="rounded object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {anime.title}
                    </h4>
                    {anime.score && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ⭐ {anime.score}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : debouncedQuery && !isLoading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No anime found for &quot;{debouncedQuery}&quot;
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
