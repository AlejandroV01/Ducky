'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { refreshSession } from '@/store/state/auth.slice'
import { persistSession } from '@/lib/session'

export function SessionInitializer() {
  const dispatch = useAppDispatch()
  const session = useAppSelector((state) => state.auth.access_token)

  useEffect(() => {
    dispatch(refreshSession())
  }, [dispatch])

  // schedule token refresh when session is loaded or updated
  // creates a loop that refreshes the token 2 minutes before it expires
  useEffect(() => {
    if (session) {
      persistSession(60 * 60 * 1000, dispatch);
    }
  }, [session, dispatch]);

  return null
}