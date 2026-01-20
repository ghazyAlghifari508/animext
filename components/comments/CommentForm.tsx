'use client'

import { useState } from 'react'
import Button from '../ui/Button'
import { FiSend } from 'react-icons/fi'

interface CommentFormProps {
  animeId: number
  onCommentAdded: () => void
}

export default function CommentForm({ animeId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animeId,
          content: content.trim(),
        }),
      })

      if (res.ok) {
        setContent('')
        onCommentAdded()
      } else {
        alert('Failed to post comment')
      }
    } catch (error) {
      console.error('Error posting comment:', error)
      alert('Failed to post comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment..."
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        rows={3}
        disabled={isSubmitting}
      />
      <div className="mt-3 flex justify-end">
        <Button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="flex items-center space-x-2"
        >
          <FiSend className="w-4 h-4" />
          <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
        </Button>
      </div>
    </form>
  )
}
