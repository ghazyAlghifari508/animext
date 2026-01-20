export interface Comment {
  id: string
  content: string
  userId: string
  animeId: number
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    name: string | null
    image: string | null
  }
  likes: CommentLike[]
  _count?: {
    likes: number
  }
}

export interface CommentLike {
  id: string
  userId: string
  commentId: string
  createdAt: Date
}

export interface CommentWithLikeStatus extends Comment {
  isLikedByUser: boolean
  likeCount: number
}
