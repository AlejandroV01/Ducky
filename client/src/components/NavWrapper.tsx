'use client'

import Nav from '@/components/Nav'
import { useAppSelector } from '@/store/hooks'
import { usePathname } from 'next/navigation'
import React from 'react'
const NavWrapper = () => {
  const excludedRoutes = ['/auth']

  const pathname = usePathname()
  const isLoggedIn = useAppSelector(state => state.user.user.user_name) !== ''
  if (excludedRoutes.includes(pathname) || isLoggedIn) {
    return null
  }

  return <Nav />
}

export default NavWrapper
