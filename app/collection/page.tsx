import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Container from '@/components/layout/Container'
import SectionHeading from '@/components/shared/SectionHeading'
import AnimeCard from '@/components/anime/AnimeCard'
import EmptyState from '@/components/ui/EmptyState'
import Pagination from '@/components/shared/Pagination'
import { FiBookmark } from 'react-icons/fi'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export const metadata = {
  title: 'My Collection - AnimeList',
  description: 'Your personal anime collection',
}

interface CollectionPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function CollectionPage({ searchParams }: CollectionPageProps) {
  const session = await getServerSession(authOptions)
  const resolvedSearchParams = await searchParams
  const currentPage = Number(resolvedSearchParams.page) || 1
  const limit = 10

  if (!session?.user?.id) {
    return (
      <Container>
        <div className="min-h-[50vh] flex items-center justify-center">
          <EmptyState
            icon={<FiBookmark className="w-16 h-16" />}
            title="Please sign in"
            description="You need to be signed in to view your collection"
          />
        </div>
      </Container>
    )
  }

  // Get total count for pagination
  const totalItems = await prisma.collection.count({
    where: { userId: session.user.id },
  })

  const totalPages = Math.ceil(totalItems / limit)

  const collections = await prisma.collection.findMany({
    where: { userId: session.user.id },
    include: {
      anime: true,
    },
    orderBy: { addedAt: 'desc' },
    skip: (currentPage - 1) * limit,
    take: limit,
  })

  // Create a client wrapper for Pagination to handle navigation
  // Since Pagination component uses client-side navigation via props or links
  // But our shared Pagination component expects onPageChange callback which is for client-state pagination
  // We need to check if Pagination component supports href-based navigation or if we need to adapt it.

  // Checking Pagination.tsx... it asks for onPageChange: (page: number) => void.
  // We need a client component wrapper or modify Pagination to support links.
  // For now, let's create a ClientPaginationWrapper or use a simple Link based approach.
  // Or better, let's make a new PaginationLink component or update the current one.
  
  // Wait, the current Pagination component is designed for client-state (passed a setter). 
  // For server components using searchParams, we need a different approach (router.push or Links).
  
  // Let's use a wrapper Client Component for the Pagination to handle the router.push
  
  return (
    <Container>
      <SectionHeading
        title="My Collection"
        subtitle={`${totalItems} anime in your collection`}
      />

      {collections.length === 0 ? (
        <EmptyState
          icon={<FiBookmark className="w-16 h-16" />}
          title={totalItems === 0 ? "Your collection is empty" : "No items on this page"}
          description={totalItems === 0 ? "Start adding anime to your collection to see them here" : "Go back to the previous page"}
          action={
            totalItems === 0 ? (
              <Link href="/">
                <Button variant="primary">Explore Anime</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {collections.map(({ anime }) => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                isAuthenticated={true}
                isInCollection={true}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
             <PaginationWrapper 
                currentPage={currentPage}
                totalPages={totalPages}
             />
          )}
        </>
      )}
    </Container>
  )
}

// Minimal Client Component Wrapper for Pagination
import PaginationWrapper from './PaginationWrapper'

