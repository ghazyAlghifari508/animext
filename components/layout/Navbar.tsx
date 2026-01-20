'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { FiSearch, FiMenu, FiX, FiUser, FiLogOut, FiHome, FiStar, FiBookmark } from 'react-icons/fi'
import Button from '../ui/Button'
import SearchBar from '../search/SearchBar'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const isAuthenticated = status === 'authenticated'


  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-500 hover:scale-105 transition-transform">
              AnimeList
            </div>
          </Link>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/"
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                    pathname === "/" 
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-500/10" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <FiHome className="w-4 h-4" />
                  <span>Home</span>
                </Link>
                <Link
                  href="/top-anime"
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                    pathname === "/top-anime"
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-500/10"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <FiStar className="w-4 h-4" />
                  <span>Top Anime</span>
                </Link>
                <Link
                  href="/collection"
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                    pathname === "/collection"
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-500/10"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <FiBookmark className="w-4 h-4" />
                  <span>Collection</span>
                </Link>



                {/* Search Icon */}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <FiSearch className="w-5 h-5" />
                </button>

                {/* Profile */}
                <div className="flex items-center space-x-3">
                  <Link href="/profile" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                    {session?.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                        {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="p-2 text-gray-700 dark:text-gray-300 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <FiLogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Button onClick={() => signIn('github')} variant="ghost">
                  Sign In
                </Button>
                <Button onClick={() => signIn('github')} variant="primary">
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Search Bar (Desktop) */}
        {searchOpen && isAuthenticated && (
          <div className="hidden md:block pb-4">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {isAuthenticated ? (
              <>
                {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
                
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FiSearch className="w-5 h-5" />
                  <span>Search</span>
                </button>

                <Link
                  href="/"
                  className={cn(
                    "flex items-center space-x-2 px-4 py-3 text-base font-medium rounded-xl transition-all",
                    pathname === "/"
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiHome className="w-5 h-5" />
                  <span>Home</span>
                </Link>

                <Link
                  href="/top-anime"
                  className={cn(
                    "flex items-center space-x-2 px-4 py-3 text-base font-medium rounded-xl transition-all",
                    pathname === "/top-anime"
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiStar className="w-5 h-5" />
                  <span>Top Anime</span>
                </Link>

                <Link
                  href="/collection"
                  className={cn(
                    "flex items-center space-x-2 px-4 py-3 text-base font-medium rounded-xl transition-all",
                    pathname === "/collection"
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiBookmark className="w-5 h-5" />
                  <span>Collection</span>
                </Link>

                <Link
                  href="/profile"
                  className={cn(
                    "flex items-center space-x-2 px-4 py-3 text-base font-medium rounded-xl transition-all",
                    pathname === "/profile"
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiUser className="w-5 h-5" />
                  <span>Profile</span>
                </Link>


                <button
                  onClick={() => {
                    signOut()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Button onClick={() => signIn('github')} variant="ghost" className="w-full">
                  Sign In
                </Button>
                <Button onClick={() => signIn('github')} variant="primary" className="w-full">
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
