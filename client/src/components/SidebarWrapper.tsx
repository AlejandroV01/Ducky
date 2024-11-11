'use client'

import { useAppSelector } from '@/store/hooks'
import { usePathname } from 'next/navigation'
import React from 'react'
import Sidebar from './Sidebar'

const SidebarWrapper = () => {
  const excludedRoutes = ['/auth']

  const pathname = usePathname()
  const isLoggedIn = useAppSelector(state => state.auth.user_name) !== ''

  if (excludedRoutes.includes(pathname) || !isLoggedIn) {
    return null
  }

  return <Sidebar />
}

export default SidebarWrapper
