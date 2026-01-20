'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { CommentWithLikeStatus } from '@/types/comment'
import CommentForm from './CommentForm'
import CommentList from './CommentList'

interface CommentSectionProps {
  animeId: number
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function CommentSection({ animeId }: CommentSectionProps) {
  const { data: comments, mutate } = useSWR<CommentWithLikeStatus[]>(
    `/api/comments?animeId=${animeId}`,
    fetcher
  )

  const handleCommentAdded = () => {
    mutate()
  }

  const handleCommentDeleted = () => {
    mutate()
  }

  const handleLikeToggled = () => {
    mutate()
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Comments ({comments?.length || 0})
      </h2>

      <div className="space-y-6">
        {/* Comment Form */}
        <CommentForm animeId={animeId} onCommentAdded={handleCommentAdded} />

        {/* Comments List */}
        {comments && (
          <CommentList
            comments={comments}
            onCommentDeleted={handleCommentDeleted}
            onLikeToggled={handleLikeToggled}
          />
        )}

        {!comments && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading comments...
          </div>
        )}
      </div>
    </div>
  )
}
