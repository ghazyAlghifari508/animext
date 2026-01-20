import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET user's collection
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const collections = await prisma.collection.findMany({
      where: { userId: session.user.id },
      include: {
        anime: true,
      },
      orderBy: { addedAt: 'desc' },
    })

    return NextResponse.json(collections)
  } catch (error) {
    console.error('Error fetching collection:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collection' },
      { status: 500 }
    )
  }
}

// POST add to collection
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
    const { animeId } = body

    if (!animeId) {
      return NextResponse.json(
        { error: 'Anime ID is required' },
        { status: 400 }
      )
    }

    // Check if already in collection
    const existing = await prisma.collection.findUnique({
      where: {
        userId_animeId: {
          userId: session.user.id,
          animeId: parseInt(animeId),
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Anime already in collection' },
        { status: 400 }
      )
    }

    // Add to collection
    const collection = await prisma.collection.create({
      data: {
        userId: session.user.id,
        animeId: parseInt(animeId),
      },
      include: {
        anime: true,
      },
    })

    return NextResponse.json(collection, { status: 201 })
  } catch (error) {
    console.error('Error adding to collection:', error)
    return NextResponse.json(
      { error: 'Failed to add to collection' },
      { status: 500 }
    )
  }
}
