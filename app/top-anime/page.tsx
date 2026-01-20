'use client'

import { useState } from 'react'
import { fetchTopAnime } from '@/lib/jikan'
import Container from '@/components/layout/Container'
import SectionHeading from '@/components/shared/SectionHeading'
import AnimeCard from '@/components/anime/AnimeCard'
import Pagination from '@/components/shared/Pagination'
import { AnimeGridSkeleton } from '@/components/ui/Skeleton'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function TopAnimePage() {
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading } = useSWR(
    `/api/anime/top?page=${currentPage}`,
    fetcher
  )

  return (
    <Container>
      <SectionHeading
        title="Top Anime"
        subtitle="The highest rated anime of all time"
      />

      {isLoading ? (
        <AnimeGridSkeleton />
      ) : data && data.data ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.data.filter((a: any) => a.id).map((anime: any, index: number) => (
              <AnimeCard
                key={`${anime.id}-${index}`}
                anime={{
                  id: anime.id,
                  title: anime.title,
                  titleEnglish: anime.titleEnglish || null,
                  synopsis: anime.synopsis || null,
                  imageUrl: anime.imageUrl || null,
                  trailerUrl: anime.trailerUrl || null,
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
                isAuthenticated={true}
              />
            ))}
          </div>


          {data.pagination && (
            <Pagination
              currentPage={currentPage}
              totalPages={data.pagination.last_visible_page || 1}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Failed to load anime
        </div>
      )}
    </Container>
  )
}
