import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET comments for an anime
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const animeId = searchParams.get('animeId')

    if (!animeId) {
      return NextResponse.json(
        { error: 'Anime ID is required' },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    const comments = await prisma.comment.findMany({
      where: { animeId: parseInt(animeId) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        likes: userId ? {
          where: { userId },
        } : false,
        _count: {
          select: { likes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Add isLikedByUser flag
    const commentsWithLikeStatus = comments.map((comment: any) => ({
      ...comment,
      isLikedByUser: userId ? comment.likes.length > 0 : false,
      likeCount: comment._count.likes,
    }))

    return NextResponse.json(commentsWithLikeStatus)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST create comment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { animeId, content } = body

    if (!animeId || !content) {
      return NextResponse.json(
        { error: 'Anime ID and content are required' },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        userId: session.user.id,
        animeId: parseInt(animeId),
        content: content.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: { likes: true },
        },
      },
    })

    return NextResponse.json({
      ...comment,
      isLikedByUser: false,
      likeCount: 0,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
