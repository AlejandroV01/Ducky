/* eslint-disable @next/next/no-img-element */
'use client'
import { signOut } from '@/store/state/auth.slice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { LogOut, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { ModeToggle } from './ModeToggle'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import UserAvatar from './UserAvatar'
const Navbar = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { user } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const handleSignOut = () => {
    dispatch(signOut())
    router.push('/')
  }
  const isSignedIn = !!isAuthenticated
  return (
    <nav className='w-full py-4 bg-background flex items-center justify-between relative shadow-[0px_0px_10px_0px_#0a0a0a6f] dark:shadow-[0px_0px_10px_0px_#ffffff28] px-20'>
      <div />
      <Link href={'/'} className='absolute left-1/2 transform -translate-x-1/2'>
        <img src='/images/logo.svg' alt='logo' className='w-[50px]' />
      </Link>
      <div className='flex items-center gap-5'>
        {isSignedIn ? (
          <div className='flex gap-5 ml-auto items-center'>
            <Link href={'/album/create'}>
              <Button className='flex gap-2'>
                <Plus size={18} />
                Create
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <UserAvatar />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={`/profile/${user.user_name}`} className='hover:cursor-pointer'>
                  <DropdownMenuItem className='hover:cursor-pointer'>Profile</DropdownMenuItem>
                </Link>
                <DropdownMenuItem className='flex items-center gap-1 hover:cursor-pointer' onClick={handleSignOut}>
                  <LogOut size={16} />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Link href={'/auth'}>
            <Button>Sign In</Button>
          </Link>
        )}
        <ModeToggle />
      </div>
    </nav>
  )
}

export default Navbar
