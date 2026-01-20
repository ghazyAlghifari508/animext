'use client'

import { CommentWithLikeStatus } from '@/types/comment'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'
import { FiTrash2 } from 'react-icons/fi'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import LikeButton from './LikeButton'

interface CommentItemProps {
  comment: CommentWithLikeStatus
  onDeleted: () => void
  onLikeToggled: () => void
}

export default function CommentItem({ comment, onDeleted, onLikeToggled }: CommentItemProps) {
  const { data: session } = useSession()
  const [isDeleting, setIsDeleting] = useState(false)
  const isOwner = session?.user?.id === comment.userId

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    setIsDeleting(true)

    try {
      const res = await fetch(`/api/comments/${comment.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        onDeleted()
      } else {
        alert('Failed to delete comment')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('Failed to delete comment')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
      <div className="flex items-start space-x-3">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          {comment.user.image ? (
            <Image
              src={comment.user.image}
              alt={comment.user.name || 'User'}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-semibold">
              {comment.user.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {comment.user.name || 'Anonymous'}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                {formatDate(comment.createdAt)}
              </span>
            </div>

            {isOwner && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-700 transition-colors p-1"
                title="Delete comment"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
            {comment.content}
          </p>

          {/* Like Button */}
          <div className="mt-3">
            <LikeButton
              commentId={comment.id}
              isLiked={comment.isLikedByUser}
              likeCount={comment.likeCount}
              onToggle={onLikeToggled}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
