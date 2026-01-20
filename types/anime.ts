export interface Anime {
  id: number
  title: string
  titleEnglish: string | null
  synopsis: string | null
  imageUrl: string | null
  trailerUrl: string | null
  score: number | null
  episodes: number | null
  status: string | null
  rating: string | null
  year: number | null
  season: string | null
  genres: string | null
  lastFetched: Date
  createdAt: Date
  updatedAt: Date
}

export interface Collection {
  id: string
  userId: string
  animeId: number
  addedAt: Date
  anime?: Anime
}
