'use client'

import { CommentWithLikeStatus } from '@/types/comment'
import CommentItem from './CommentItem'
import EmptyState from '../ui/EmptyState'
import { FiMessageSquare } from 'react-icons/fi'

interface CommentListProps {
  comments: CommentWithLikeStatus[]
  onCommentDeleted: () => void
  onLikeToggled: () => void
}

export default function CommentList({ comments, onCommentDeleted, onLikeToggled }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <EmptyState
        icon={<FiMessageSquare className="w-16 h-16" />}
        title="No comments yet"
        description="Be the first to share your thoughts about this anime!"
      />
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onDeleted={onCommentDeleted}
          onLikeToggled={onLikeToggled}
        />
      ))}
    </div>
  )
}
