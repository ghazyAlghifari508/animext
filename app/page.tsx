import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Container from '@/components/layout/Container'
import SectionHeading from '@/components/shared/SectionHeading'
import TopAnimeSection from '@/components/anime/TopAnimeSection'
import FeaturedCarousel from '@/components/anime/FeaturedCarousel'
import { AnimeGridSkeleton } from '@/components/ui/Skeleton'

interface HomePageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const session = await getServerSession(authOptions)
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams.page) || 1

  return (
    <div>
      {/* Featured Anime Carousel */}
      <Suspense fallback={
        <div className="h-[500px] md:h-[600px] bg-gray-900 animate-pulse" />
      }>
        <FeaturedCarousel isAuthenticated={!!session} />
      </Suspense>

      {/* Top Anime Section */}
      <Container className="py-16">
        <SectionHeading
          title="Top Rated Anime"
          subtitle="Discover the highest rated anime of all time"
        />
        <Suspense fallback={<AnimeGridSkeleton />}>
          <TopAnimeSection isAuthenticated={!!session} page={page} />
        </Suspense>
      </Container>
    </div>
  )
}

