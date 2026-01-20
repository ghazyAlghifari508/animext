'use client'

import { useEffect } from 'react'
import Container from '@/components/layout/Container'
import Button from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container>
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Something went wrong!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error.message || 'An unexpected error occurred'}
          </p>
          <Button onClick={reset} variant="primary" size="lg">
            Try again
          </Button>
        </div>
      </div>
    </Container>
  )
}
