import { NextRequest, NextResponse } from 'next/server'
import { fetchTopAnime } from '@/lib/jikan'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')

    const jikanData = await fetchTopAnime(page)

    return NextResponse.json({
      data: jikanData.data.map((anime) => ({
        id: anime.mal_id,
        title: anime.title,
        titleEnglish: anime.title_english,
        synopsis: anime.synopsis,
        imageUrl: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
        trailerUrl: anime.trailer?.embed_url || anime.trailer?.url,
        score: anime.score,
        episodes: anime.episodes,
        status: anime.status,
        rating: anime.rating,
        year: anime.year,
        season: anime.season,
        genres: anime.genres,
      })),
      pagination: jikanData.pagination,
    })
  } catch (error) {
    console.error('Error fetching top anime:', error)
    return NextResponse.json(
      { error: 'Failed to fetch top anime' },
      { status: 500 }
    )
  }
}
