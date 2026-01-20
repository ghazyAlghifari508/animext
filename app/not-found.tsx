import Link from 'next/link'
import Container from '@/components/layout/Container'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Container>
        <div className="text-center">
          <h1 className="text-9xl font-bold mb-4 text-indigo-100 dark:text-indigo-900/30">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Anime Not Found</h2>
          <p className="text-lg md:text-xl mb-8 max-w-md mx-auto text-gray-600 dark:text-gray-400">
            Looks like this anime doesn&apos;t exist in our database... yet!
          </p>
          <Link href="/">
            <Button variant="primary" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  )
}

