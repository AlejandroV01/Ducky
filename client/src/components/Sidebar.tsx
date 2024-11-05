'use client'
import { useAppSelector } from '@/store/hooks'
import { Compass, Home, Search, SquarePlus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import Logo from './Logo'
import { ModeToggle } from './ModeToggle'
import UserAvatar from './UserAvatar'
const Sidebar = () => {
  const user = useAppSelector(state => state.auth)
  const sidebarItems = [
    { icon: <Home />, name: 'Home', path: '/' },
    { icon: <Search />, name: 'Search', path: '/search' },
    { icon: <Compass />, name: 'Explore', path: '/explore' },
    { icon: <SquarePlus />, name: 'Create', path: '/create' },
    { icon: <UserAvatar size={30} />, name: 'Profile', path: `/profile/${user.user_name}` },
  ]
  const currentPath = usePathname()
  return (
    <div className='h-svh hidden lg:flex lg:min-w-64 border-r-2 fixed top-0 flex-col justify-between'>
      <div className='flex flex-col mt-10 px-4'>
        <div className='px-2 mb-5'>
          <Logo size={50} />
        </div>
        {sidebarItems.map((item, index) => (
          <Link
            key={index}
            className='flex gap-2 transition-colors duration-300 py-4 cursor-pointer hover:bg-primary/20 rounded-lg px-2'
            href={item.path}
          >
            {item.icon} <span className={currentPath === item.path ? 'font-semibold' : ''}>{item.name}</span>
          </Link>
        ))}
      </div>
      <div className='p-4 mt-auto'>
        <ModeToggle />
      </div>
    </div>
  )
}

export default Sidebar
