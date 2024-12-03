'use client'
import React from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { updateUser } from '@/store/state/user.slice'
import { useState } from 'react'
import Logout from '@/components/LogoutButton'

interface Profile {
  params: {
    profileId: string
  }
}

export default function Profile({ params }: Profile) {
  const { user } = useAppSelector((state) => state.user)
  const [firstName, setFirstName] = useState(user.first_name)
  const [lastName, setLastName] = useState(user.last_name)
  const [userName, setUserName] = useState(user.user_name)
  const { profileId } = params
  console.log(profileId)

  const dispatch = useAppDispatch()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(updateUser({ first_name: firstName, last_name: lastName, user_name: userName }))
  }

  return (
    <div className='flex flex-col w-full items-center'>
      <h1 className='text-center text-yellow-500 text-3xl font-bold'>Profile</h1>
      <p className='text-center text-yellow-400 text-1xl font-semibold'>Profile ID From Params: {profileId}</p>
      <p className='text-center text-yellow-400 text-1xl font-semibold'>Current user from redux store</p>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <label className='flex flex-col gap-1'>
          First Name
          <input
            className='border border-gray-300 rounded-md p-2'
            type='text'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        <label className='flex flex-col gap-1'>
          Last Name
          <input
            className='border border-gray-300 rounded-md p-2'
            type='text'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
        <label className='flex flex-col gap-1'>
          User Name
          <input
            className='border border-gray-300 rounded-md p-2'
            type='text'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </label>
        <button className='bg-yellow-500 text-black font-bold p-2 rounded-md' type='submit'> Update Profile </button>
      </form>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <Logout />
    </div>
  )
}