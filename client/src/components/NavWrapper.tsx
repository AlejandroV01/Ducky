'use client'

import Nav from '@/components/Nav'
import { usePathname } from 'next/navigation'
import React from 'react'

const NavWrapper = () => {
  const excludedRoutes = ['/auth']

  const pathname = usePathname()

  if (excludedRoutes.includes(pathname)) {
    return null
  }

  return <Nav />
}

export default NavWrapper
