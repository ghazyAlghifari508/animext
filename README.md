# AnimeList - Your Personal Anime Collection

A modern, full-stack anime discovery and collection management web application built with Next.js 14, MyAnimeList API, and GitHub OAuth authentication.

![AnimeList](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql)

## ✨ Features

### 🔐 Authentication & Authorization
- **GitHub OAuth** integration via NextAuth.js
- Route protection with Next.js middleware
- Session-based authentication
- Conditional UI based on auth state

### 🎬 Anime Features
- Browse top anime from MyAnimeList
- Search anime with debounced input
- Detailed anime pages with:
  - Synopsis, ratings, genres
  - YouTube trailer embeds
  - Episode count and status
- **Smart Caching Layer** - Anime data cached in MySQL for 7 days
- Rate limiting for Jikan API (3 req/sec)

### 📚 Collection System
- Add/remove anime to personal collection
- Duplicate prevention at database level
- View all collected anime on dedicated page
- Real-time collection status updates

### 💬 Comment System
- Post comments on anime pages
- Like/unlike comments (upvote system)
- Delete own comments
- Real-time comment count
- Display user GitHub avatar and name

### 🎨 UI/UX
- **Custom Design** - No template or AI-generated UI
- Dark mode support
- Fully responsive (mobile-first)
- Smooth animations and transitions
- Loading skeletons
- Empty states for better UX
- Custom 404 page

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Database** | MySQL 8.0+ |
| **ORM** | Prisma |
| **Authentication** | NextAuth.js v5 |
| **OAuth Provider** | GitHub |
| **External API** | Jikan API v4 (MAL) |
| **Styling** | Tailwind CSS |
| **State Management** | SWR |
| **Icons** | React Icons |

## 📁 Project Structure

```
animext/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── auth/             # NextAuth endpoints
│   │   ├── anime/            # Anime endpoints
│   │   ├── collection/       # Collection CRUD
│   │   └── comments/         # Comment & like endpoints
│   ├── anime/[id]/           # Anime detail page
│   ├── collection/           # User collection page
│   ├── profile/              # User profile page
│   ├── signin/               # Sign in page
│   ├── top-anime/            # Top anime list
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   ├── not-found.tsx         # 404 page
│   └── error.tsx             # Error boundary
├── components/               # React Components
│   ├── anime/                # Anime-related components
│   ├── collection/           # Collection components
│   ├── comments/             # Comment system components
│   ├── layout/               # Navbar, Footer, Container
│   ├── search/               # Search bar
│   ├── shared/               # Pagination, SectionHeading
│   ├── ui/                   # Button, Input, Card, Skeleton
│   └── providers/            # SessionProvider
├── lib/                      # Utilities & Config
│   ├── auth.ts               # NextAuth configuration
│   ├── prisma.ts             # Prisma client
│   ├── jikan.ts              # Jikan API client
│   ├── cache.ts              # Anime caching logic
│   └── utils.ts              # Helper functions
├── hooks/                    # Custom React hooks
│   └── useDebounce.ts        # Search debouncing
├── types/                    # TypeScript definitions
│   ├── anime.ts
│   ├── comment.ts
│   └── next-auth.d.ts
├── prisma/
│   └── schema.prisma         # Database schema
├── middleware.ts             # Route protection
└── .env.local                # Environment variables
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MySQL 8.0+
- GitHub OAuth App

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/animext.git
cd animext
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE animelist CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Environment Variables

Create `.env.local` file:

```env
# Database
DATABASE_URL="mysql://root:password@localhost:3306/animelist"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"

# GitHub OAuth
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Jikan API
JIKAN_API_URL="https://api.jikan.moe/v4"
```

#### Setting up GitHub OAuth:

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: AnimeList
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy **Client ID** and **Client Secret** to `.env.local`

### 5. Run Database Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 6. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

```prisma
User ─┬─< Account
      ├─< Session
      ├─< Collection ─> Anime ─┬─< Comment
      ├─< Comment             │
      └─< CommentLike ────────┘
```

### Key Models:
- **User**: GitHub OAuth user data
- **Anime**: Cached anime from Jikan API
- **Collection**: User's saved anime
- **Comment**: User comments on anime
- **CommentLike**: Upvote system for comments

## 🔧 Key Features Implementation

### 1. Anime Caching Strategy

```typescript
// lib/cache.ts
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

// Check database first, fetch from API if cache is stale
export async function getCachedAnime(animeId: number) {
  const cached = await prisma.anime.findUnique({ where: { id: animeId } })
  
  if (cached && isFresh(cached.lastFetched)) {
    return cached // Return cached data
  }
  
  // Fetch from Jikan API and update cache
  const jikanData = await fetchAnimeFromJikan(animeId)
  return await prisma.anime.upsert({ ... })
}
```

### 2. Middleware Protection

```typescript
// middleware.ts
export const config = {
  matcher: [
    "/anime/:path*",
    "/collection/:path*",
    "/profile/:path*",
  ],
}
```

Protected routes redirect unauthenticated users to sign-in page.

### 3. Rate Limiting (Jikan API)

```typescript
// lib/jikan.ts
import pLimit from 'p-limit'

const limit = pLimit(3) // Max 3 concurrent requests

export async function fetchAnimeFromJikan(id: number) {
  return limit(async () => {
    // Handle 429 rate limit errors with retry
  })
}
```

## 📖 API Routes

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/anime/[id]` | GET | No | Get anime details |
| `/api/anime/search` | GET | No | Search anime |
| `/api/anime/top` | GET | No | Get top anime |
| `/api/collection` | GET | Yes | Get user collection |
| `/api/collection` | POST | Yes | Add to collection |
| `/api/collection/[id]` | DELETE | Yes | Remove from collection |
| `/api/comments` | GET | No | Get anime comments |
| `/api/comments` | POST | Yes | Post comment |
| `/api/comments/[id]` | DELETE | Yes | Delete own comment |
| `/api/comments/[id]/like` | POST | Yes | Toggle like |

## 🎨 UI Components

All components are custom-built with Tailwind CSS:

- `<Button>` - 4 variants (primary, secondary, ghost, danger)
- `<Input>` - Form input with focus states
- `<Card>` - Content container with hover effects
- `<Skeleton>` - Loading placeholders
- `<EmptyState>` - No data states
- `<Pagination>` - Page navigation with ellipsis
- `<AnimeCard>` - Anime display card
- `<SearchBar>` - Debounced search with dropdown

## 🚨 Error Handling

- **API Errors**: Handled with try-catch and user-friendly messages
- **Rate Limits**: Automatic retry with exponential backoff
- **404 Pages**: Custom not found page
- **Error Boundaries**: Global error handling

## 🔐 Security

- CSRF protection via NextAuth
- SQL injection prevention via Prisma
- XSS protection in user inputs
- Session-based authentication
- Secure password hashing (handled by GitHub OAuth)

## 📝 License

MIT License - feel free to use this project for learning or production!

## 🙏 Acknowledgments

- [Jikan API](https://jikan.moe/) - Unofficial MyAnimeList API
- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js

---

Made with ❤️ by AnimeList Team
