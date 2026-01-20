'use client'

import { signIn } from 'next-auth/react'
import { FiGithub } from 'react-icons/fi'
import Container from '@/components/layout/Container'
import Button from '@/components/ui/Button'

export default function SignInPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Welcome to AnimeList
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to access your collection and join the community
              </p>
            </div>

            <Button
              onClick={() => signIn('github', { callbackUrl: '/' })}
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center space-x-3"
            >
              <FiGithub className="w-5 h-5" />
              <span>Sign in with GitHub</span>
            </Button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}
