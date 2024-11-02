'use client'
import { Compass, Home, Search, SquarePlus } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React from 'react'
const Sidebar = () => {
  const sidebarItems = [
    { icon: <Home />, name: 'Home', path: '/' },
    { icon: <Search />, name: 'Search', path: '/search' },
    { icon: <Compass />, name: 'Explore', path: '/explore' },
    { icon: <SquarePlus />, name: 'Create', path: '/create' },
  ]
  const currentPath = usePathname()
  return (
    <div className='svh-minus-nav lg:min-w-52 md:min-w-32 border-r-2'>
      <div className='flex flex-col mt-10'>
        {sidebarItems.map((item, index) => (
          <div key={index} className='flex gap-2 hover:bg-primary/10 transition-colors duration-500 p-4 cursor-pointer'>
            {item.icon} <span className={currentPath === item.path ? 'font-semibold' : ''}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
