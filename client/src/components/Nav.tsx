/* eslint-disable @next/next/no-img-element */
'use client'
import { removeProfile } from '@/store/auth/auth.slice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { LogOut, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
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
  const username = useAppSelector(state => state.auth.user_name)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const handleSignOut = () => {
    dispatch(removeProfile())
    router.push('/')
  }
  const isSignedIn = !!username
  return (
    <nav className='w-full py-2 bg-background flex items-center justify-between relative shadow-[0px_0px_10px_0px] px-20 mb-4'>
      <div className='w-12'></div>
      <Link href={'/'} className='absolute left-1/2 transform -translate-x-1/2'>
        <img src='/images/logo.svg' alt='logo' className='w-[50px]' />
      </Link>
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
              <Link href={`/profile/${username}`} className='hover:cursor-pointer'>
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
    </nav>
  )
}

export default Navbar
