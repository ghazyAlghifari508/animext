import { NextRequest, NextResponse } from 'next/server'
import { getCachedAnime } from '@/lib/cache'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const animeId = parseInt(id)

    if (isNaN(animeId)) {
      return NextResponse.json(
        { error: 'Invalid anime ID' },
        { status: 400 }
      )
    }

    const anime = await getCachedAnime(animeId)

    return NextResponse.json(anime)
  } catch (error) {
    console.error('Error fetching anime:', error)
    return NextResponse.json(
      { error: 'Failed to fetch anime' },
      { status: 500 }
    )
  }
}
