'use client'

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Button from '../ui/Button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show with ellipsis
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="ghost"
        size="sm"
      >
        <FiChevronLeft className="w-5 h-5" />
      </Button>

      {getPageNumbers().map((page, index) => (
        <div key={index}>
          {typeof page === 'number' ? (
            <Button
              onClick={() => onPageChange(page)}
              variant={currentPage === page ? 'primary' : 'ghost'}
              size="sm"
              className="min-w-[2.5rem]"
            >
              {page}
            </Button>
          ) : (
            <span className="px-2 text-gray-500 dark:text-gray-400">
              {page}
            </span>
          )}
        </div>
      ))}

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="ghost"
        size="sm"
      >
        <FiChevronRight className="w-5 h-5" />
      </Button>
    </div>
  )
}
