'use client'

import { usePathname } from 'next/navigation'
import React from 'react'
import Sidebar from './Sidebar'

const SidebarWrapper = () => {
  const excludedRoutes = ['/auth']

  const pathname = usePathname()

  if (excludedRoutes.includes(pathname)) {
    return null
  }

  return <Sidebar />
}

export default SidebarWrapper
