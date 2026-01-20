'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Pagination from '@/components/shared/Pagination'

interface PaginationWrapperProps {
  currentPage: number
  totalPages: number
  basePath?: string
}

export default function PaginationWrapper({ currentPage, totalPages, basePath = '/collection' }: PaginationWrapperProps) {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    // Create new URLSearchParams with the existing params
    // We don't construct from searchParams directly to avoid read-only issues, 
    // but here simple string concatenation for the path is easier since we are just changing page.
    const path = basePath === '/' ? `/?page=${page}` : `${basePath}?page=${page}`
    router.push(path)
  }

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  )
}
