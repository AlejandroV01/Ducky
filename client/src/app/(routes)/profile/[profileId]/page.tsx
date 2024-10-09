'use client'
import React from 'react'

interface Profile {
  params: {
    profileId: string
  }
}

export default function Profile({ params }: Profile) {
  const { profileId } = params

  return (
    <div>
      <h1 className='text-center text-yellow-500 text-3xl font-bold'>Profile</h1>
      <p className='text-center text-yellow-400 text-1xl font-semibold'>Profile ID: {profileId}</p>
    </div>
  )
}
