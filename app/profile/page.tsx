import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Container from '@/components/layout/Container'
import Image from 'next/image'
import { FiCalendar, FiMessageSquare, FiBookmark, FiActivity, FiUser, FiClock } from 'react-icons/fi'
import Link from 'next/link'
import { Collection, Comment, Anime } from '@prisma/client'

export const metadata = {
  title: 'My Profile - AnimeList',
  description: 'Your profile and statistics',
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return null
  }

  // Get user stats
  const [collectionsCount, commentsCount] = await Promise.all([
    prisma.collection.count({ where: { userId: session.user.id } }),
    prisma.comment.count({ where: { userId: session.user.id } }),
  ])

  // Get recent comments
  const recentComments = await prisma.comment.findMany({
    where: { userId: session.user.id },
    include: {
      anime: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  // Get recent collections
  const recentCollections = await prisma.collection.findMany({
    where: { userId: session.user.id },
    include: {
      anime: true,
    },
    orderBy: { addedAt: 'desc' },
    take: 4,
  })

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0f1117]">
      {/* Abstract Professional Header */}
      <div className="h-48 md:h-64 bg-[#1a1c23] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <svg className="h-full w-full text-indigo-500/10" fill="currentColor">
                <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#pattern-circles)" />
            </svg>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50/50 dark:from-[#0f1117] to-transparent" />
      </div>

      <Container className="-mt-24 md:-mt-32 relative z-10 pb-20">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Left Sidebar: Profile Card */}
          <div className="w-full md:w-80 flex-shrink-0 space-y-6">
            <div className="bg-white dark:bg-[#1e2029] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
                <div className="relative w-32 h-32 mx-auto mb-4">
                    {session.user.image ? (
                    <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        fill
                        className="rounded-full object-cover border-4 border-white dark:border-[#1e2029] shadow-md"
                    />
                    ) : (
                    <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-4xl font-bold text-slate-500 dark:text-slate-300 border-4 border-white dark:border-[#1e2029]">
                        {session.user.name?.[0]?.toUpperCase()}
                    </div>
                    )}
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-[#1e2029] rounded-full" title="Online" />
                </div>
                
                <div className="text-center mb-6">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">{session.user.name}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{session.user.email}</p>
                    <div className="mt-3 inline-flex items-center px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold border border-indigo-100 dark:border-indigo-500/20">
                        Top Contributor
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-700/50 pt-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{collectionsCount}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider font-medium mt-1">Saved</div>
                    </div>
                    <div className="text-center border-l border-gray-100 dark:border-gray-700/50">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{commentsCount}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider font-medium mt-1">Reviews</div>
                    </div>
                </div>
            </div>

            {/* Developer/Badge Card (Subtle) */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-indigo-500 rounded-full blur-3xl opacity-20" />
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                         <span className="font-bold text-xl">PRO</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight">Pro Member</h3>
                        <p className="text-slate-400 text-xs">Unlock exclusive features.</p>
                    </div>
                </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            
            {/* Recent Collections */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FiBookmark className="text-indigo-500" />
                        <span>Recent Collections</span>
                    </h2>
                    <Link href="/collection" className="text-sm font-medium text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">
                        View All
                    </Link>
                </div>

                {recentCollections.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {recentCollections.map((item: Collection & { anime: Anime }) => (
                            <Link key={item.id} href={`/anime/${item.animeId}`} className="group block">
                                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-800">
                                    {item.anime.imageUrl ? (
                                        <Image
                                            src={item.anime.imageUrl}
                                            alt={item.anime.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                        <p className="text-white text-xs font-medium line-clamp-2">{item.anime.title}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-[#1e2029] rounded-2xl p-8 text-center border-dashed border-2 border-gray-200 dark:border-gray-700">
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3 text-gray-400">
                            <FiBookmark className="w-6 h-6" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No anime collected yet.</p>
                        <Link href="/top-anime" className="text-indigo-600 text-sm font-semibold hover:underline mt-2 inline-block">
                            Browse Anime
                        </Link>
                    </div>
                )}
            </section>

            {/* Recent Activity */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FiActivity className="text-emerald-500" />
                        <span>Recent Activity</span>
                    </h2>
                </div>

                <div className="bg-white dark:bg-[#1e2029] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    {recentComments.length > 0 ? (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {recentComments.map((comment: Comment & { anime: Anime }) => (
                                <div key={comment.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                <FiMessageSquare className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                                                    Commented on <Link href={`/anime/${comment.animeId}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">{comment.anime.title}</Link>
                                                </h4>
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <FiClock className="w-3 h-3" />
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                                "{comment.content}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="p-12 text-center">
                            <p className="text-gray-500 dark:text-gray-400">No recent activity found.</p>
                        </div>
                    )}
                </div>
            </section>
          </div>

        </div>
      </Container>
    </div>
  )
}


