'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store/hooks'
import { googleCallback } from '@/store/state/auth.slice'

export default function GoogleCallback() {
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    const processGoogleCallback = async () => {
      try {
        const code = searchParams.get('code')
        if (!code) {
          throw new Error('No authorization code received')
        }
        console.log("code", code)

        dispatch(googleCallback(code))

        router.push('/')
      } catch (error) {
        console.error('Google callback error:', error)
        router.push('/auth?error=google-auth-failed')
      }
    }

    processGoogleCallback()
  }, [searchParams, dispatch, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Completing sign in...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  )
}