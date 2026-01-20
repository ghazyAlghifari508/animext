import Link from 'next/link'
import { FiGithub, FiHeart } from 'react-icons/fi'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-indigo-500 mb-4">
              AnimeList
            </h3>

            <p className="text-sm text-gray-400">
              Your personal anime collection and discovery platform powered by MyAnimeList data.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/top-anime" className="hover:text-indigo-400 transition-colors">
                  Top Anime
                </Link>
              </li>
              <li>
                <Link href="/collection" className="hover:text-indigo-400 transition-colors">
                  My Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://jikan.moe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Jikan API
                </a>
              </li>
              <li>
                <a
                  href="https://myanimelist.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-400 transition-colors"
                >
                  MyAnimeList
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-white font-semibold mb-4">Community</h4>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition-colors"
              >
                <FiGithub className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p className="flex items-center justify-center space-x-1">
            <span>Made with</span>
            <FiHeart className="w-4 h-4 text-red-500" />
            <span>by Ghazy nabil alghifari | alghifarighazy508@gmail.com</span>
          </p>

          <p className="mt-2 text-gray-500 text-xs">
            Powered by Jikan API - Unofficial MyAnimeList API
          </p>
        </div>
      </div>
    </footer>
  )
}
