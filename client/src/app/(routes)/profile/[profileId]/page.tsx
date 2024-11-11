'use client'
import React from 'react'
import { useAppSelector } from '@/store/hooks'
import Logout from '@/components/LogoutButton'

interface Profile {
  params: {
    profileId: string
  }
}

export default function Profile({ params }: Profile) {
  const { user } = useAppSelector((state) => state.user)
  const { profileId } = params
  console.log(profileId)

  return (
    <div className='flex flex-col w-full items-center'>
      <h1 className='text-center text-yellow-500 text-3xl font-bold'>Profile</h1>
      <p className='text-center text-yellow-400 text-1xl font-semibold'>Profile ID From Params: {profileId}</p>
      <p className='text-center text-yellow-400 text-1xl font-semibold'>Current user from redux store</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <Logout />
    </div>
  )
}