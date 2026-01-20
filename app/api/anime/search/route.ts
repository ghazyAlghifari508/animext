import { NextRequest, NextResponse } from 'next/server'
import { searchAnime } from '@/lib/jikan'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const page = parseInt(searchParams.get('page') || '1')

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    // Try database first (cached anime)
    const cachedResults = await prisma.anime.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { titleEnglish: { contains: query } },
        ],
      },
      take: 20,
      orderBy: { score: 'desc' },
    })

    if (cachedResults.length > 0) {
      return NextResponse.json({
        results: cachedResults,
        source: 'cache',
      })
    }

    // Fallback to Jikan API
    const jikanData = await searchAnime(query, page)

    return NextResponse.json({
      results: jikanData.data.map((anime) => ({
        id: anime.mal_id,
        title: anime.title,
        titleEnglish: anime.title_english,
        imageUrl: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
        score: anime.score,
        year: anime.year,
        episodes: anime.episodes,
      })),
      pagination: jikanData.pagination,
      source: 'api',
    })
  } catch (error) {
    console.error('Error searching anime:', error)
    return NextResponse.json(
      { error: 'Failed to search anime' },
      { status: 500 }
    )
  }
}
