'use client'

import { useState } from 'react'
import { FiHeart } from 'react-icons/fi'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
  commentId: string
  isLiked: boolean
  likeCount: number
  onToggle: () => void
}

export default function LikeButton({ commentId, isLiked, likeCount, onToggle }: LikeButtonProps) {
  const [liked, setLiked] = useState(isLiked)
  const [count, setCount] = useState(likeCount)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)

    // Optimistic update
    const newLiked = !liked
    setLiked(newLiked)
    setCount((prev) => (newLiked ? prev + 1 : prev - 1))

    try {
      const res = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      })

      if (!res.ok) {
        // Revert on error
        setLiked(!newLiked)
        setCount((prev) => (newLiked ? prev - 1 : prev + 1))
      } else {
        onToggle()
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      // Revert on error
      setLiked(!newLiked)
      setCount((prev) => (newLiked ? prev - 1 : prev + 1))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        'flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200',
        liked
          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
      )}
    >
      <FiHeart
        className={cn('w-4 h-4 transition-all', liked && 'fill-current')}
      />
      <span className="text-sm font-medium">{count}</span>
    </button>
  )
}
