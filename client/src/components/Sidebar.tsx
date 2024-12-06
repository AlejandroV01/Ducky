'use client'
import { useAppSelector } from '@/store/hooks'
import { Compass, Home, LogIn, Search, SquarePlus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import Logo from './Logo'
import { ModeToggle } from './ModeToggle'
import UserAvatar from './UserAvatar'
const Sidebar = () => {
  const user = useAppSelector(state => state.user.user)
  const sidebarItems = [
    { icon: <Home />, name: 'Home', path: '/' },
    //{ icon: <Search />, name: 'Search', path: '/search' },
    //{ icon: <Compass />, name: 'Explore', path: '/explore' },
    { icon: <SquarePlus />, name: 'Create', path: '/album/create' },
  ]
  const currentPath = usePathname()
  return (
    <div className='h-svh hidden lg:flex lg:min-w-64 border-r-2 fixed top-0 flex-col justify-between'>
      <div className='flex flex-col mt-10 px-4'>
        <Link className='px-2 mb-5 flex items-center gap-2 w-fit' href={'/'}>
          <Logo size={50} />
          <h2 className='font-bold text-2xl'>Ducky</h2>
        </Link>
        {sidebarItems.map((item, index) => (
          <Link
            key={index}
            className='flex gap-2 transition-colors duration-300 py-4 cursor-pointer hover:bg-primary/20 rounded-lg px-2'
            href={item.path}
          >
            {item.icon} <span className={currentPath === item.path ? 'font-semibold' : ''}>{item.name}</span>
          </Link>
        ))}
        {user.user_name ? (
          <Link
            className='flex gap-2 transition-colors duration-300 py-4 cursor-pointer hover:bg-primary/20 rounded-lg px-2'
            href={`/profile/${user.user_name}`}
          >
            <UserAvatar size={30} /> <span className={currentPath === `/profile/${user.user_name}` ? 'font-semibold' : ''}>Profile</span>
          </Link>
        ) : (
          <Link
            className='flex gap-2 transition-colors duration-300 py-4 cursor-pointer hover:bg-primary/20 rounded-lg px-2 items-center'
            href={`/auth`}
          >
            <LogIn /> <span className={currentPath === `/auth` ? 'font-semibold' : ''}>Login</span>
          </Link>
        )}
      </div>

      <div className='p-4 mt-auto'>
        <ModeToggle />
      </div>
    </div>
  )
}

export default Sidebar
