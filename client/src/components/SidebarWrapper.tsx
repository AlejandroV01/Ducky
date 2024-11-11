'use client'

import { useAppSelector } from '@/store/hooks'
import { usePathname } from 'next/navigation'
import React from 'react'
import Sidebar from './Sidebar'

const SidebarWrapper = () => {
  const excludedRoutes = ['/auth']

  const pathname = usePathname()
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  if (excludedRoutes.includes(pathname) || !isAuthenticated) {
    return null
  }

  return <Sidebar />
}

export default SidebarWrapper
