'use client'

import { useState } from 'react'
import Button from '../ui/Button'
import { FiBookmark, FiCheck } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

interface CollectionButtonProps {
  animeId: number
  initialInCollection: boolean
}

export default function CollectionButton({ animeId, initialInCollection }: CollectionButtonProps) {
  const [inCollection, setInCollection] = useState(initialInCollection)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async () => {
    setIsLoading(true)

    try {
      if (inCollection) {
        // Remove from collection
        const res = await fetch(`/api/collection/${animeId}`, {
          method: 'DELETE',
        })

        if (res.ok) {
          setInCollection(false)
          router.refresh()
        } else {
          alert('Failed to remove from collection')
        }
      } else {
        // Add to collection
        const res = await fetch('/api/collection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ animeId }),
        })

        if (res.ok) {
          setInCollection(true)
          router.refresh()
        } else {
          const data = await res.json()
          alert(data.error || 'Failed to add to collection')
        }
      }
    } catch (error) {
      console.error('Error toggling collection:', error)
      alert('Failed to update collection')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleToggle}
      disabled={isLoading}
      variant={inCollection ? 'secondary' : 'primary'}
      size="lg"
      className="flex items-center space-x-2"
    >
      {inCollection ? (
        <>
          <FiCheck className="w-5 h-5" />
          <span>{isLoading ? 'Removing...' : 'In Collection'}</span>
        </>
      ) : (
        <>
          <FiBookmark className="w-5 h-5" />
          <span>{isLoading ? 'Adding...' : 'Add to Collection'}</span>
        </>
      )}
    </Button>
  )
}
