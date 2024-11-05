/* eslint-disable @next/next/no-img-element */
import { useAppSelector } from '@/store/hooks'
import { RootState } from '@/store/store'
import { CheckCircle, LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import UserAvatar from '../UserAvatar'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
export const Post = () => {
  const user = useAppSelector((state: RootState) => state.auth)
  const date = new Date('2024-10-13 05:05:44.904557+00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const [isRequestedToJoin, setIsRequestedToJoin] = useState(false)
  const [isRequestedToJoinLoading, setIsRequestedToJoinLoading] = useState(false)
  const handleRequestToJoin = () => {
    setIsRequestedToJoinLoading(true)
    // Make a request to the server to join the album, mock a timeout
    setTimeout(() => {
      setIsRequestedToJoin(true)
      setIsRequestedToJoinLoading(false)
    }, 2000)
  }
  return (
    <Card className='max-w-[550px] p-4 dark:bg-foreground/5 rounded-lg shadow-md flex flex-col'>
      <Link className='flex items-center gap-2 mb-2 hover:underline w-fit' href={`/profile/${user.user_name}`}>
        <UserAvatar size={30} />
        <span className='font-semibold'>{user.user_name}</span>
      </Link>
      <div>
        <span className='block text-xl font-semibold mb-2'>Album Title Here</span>
        <PostPreview />
        <div className='flex flex-wrap items-start gap-2 mt-4'>
          <p className='flex-1 min-w-0 break-all'>
            <Link className='font-semibold hover:underline' href={`/profile/${user.user_name}`}>
              {user.user_name}:
            </Link>{' '}
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil error enim nemo, in praesentium temporibus.
          </p>
        </div>
      </div>
      <div className='w-full flex items-center justify-between mt-5'>
        <span className='text-sm'>{date}</span>
        <Button
          size={'sm'}
          onClick={handleRequestToJoin}
          className={`${isRequestedToJoin && 'bg-green-400 flex items-center gap-2 hover:bg-green-300 transition-colors duration-500'}`}
        >
          {isRequestedToJoin && <CheckCircle size={16} />}
          {isRequestedToJoinLoading && <LoaderCircle size={16} className='animate-spin mr-2' />}
          {isRequestedToJoin ? <span>Requested</span> : <span>Request to Join</span>}
        </Button>
      </div>
    </Card>
  )
}

const PostPreview = () => {
  const images: string[] = [
    'https://nlgbrupftredhrjormbc.supabase.co/storage/v1/object/sign/photos/Users/lebron_james/Bronny_Pics/anders-jilden-uwbajDCODj4-unsplash.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvVXNlcnMvbGVicm9uX2phbWVzL0Jyb25ueV9QaWNzL2FuZGVycy1qaWxkZW4tdXdiYWpEQ09EajQtdW5zcGxhc2guanBnIiwiaWF0IjoxNzMwODM3NjQyLCJleHAiOjE3NjIzNzM2NDJ9.QVXi2AU5a6vUhqEWx48oKuagAbIon86_E18mpc_gKRg&t=2024-11-05T20%3A14%3A03.359Z',
    'https://nlgbrupftredhrjormbc.supabase.co/storage/v1/object/sign/photos/Users/lebron_james/Bronny_Pics/daniel-leone-g30P1zcOzXo-unsplash.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvVXNlcnMvbGVicm9uX2phbWVzL0Jyb25ueV9QaWNzL2RhbmllbC1sZW9uZS1nMzBQMXpjT3pYby11bnNwbGFzaC5qcGciLCJpYXQiOjE3MzA4Mzc2ODMsImV4cCI6MTc2MjM3MzY4M30.2503lXxt2fTdcNudFXbl8sPHEGExhSccCd0Fj_A99JM&t=2024-11-05T20%3A14%3A44.189Z',
    'https://nlgbrupftredhrjormbc.supabase.co/storage/v1/object/sign/photos/Users/lebron_james/Bronny_Pics/hendrik-cornelissen--qrcOR33ErA-unsplash.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvVXNlcnMvbGVicm9uX2phbWVzL0Jyb25ueV9QaWNzL2hlbmRyaWstY29ybmVsaXNzZW4tLXFyY09SMzNFckEtdW5zcGxhc2guanBnIiwiaWF0IjoxNzMwODM3Njk0LCJleHAiOjE3NjIzNzM2OTR9.xCNU6Iyzglax38M-DXXd3_QSGwYvmA5s8WI3v17n1Jo&t=2024-11-05T20%3A14%3A55.086Z',
  ]
  const albumTitle = 'Album Title Here'
  const albumOwner = 'lebron_james'
  return (
    <div className='grid gap-1 grid-cols-2 grid-rows-2'>
      {images.map((url, index) => (
        <div key={index} className={`relative ${index === 0 ? 'row-span-2' : ''} w-full h-full`}>
          <img
            src={url}
            alt={`Preview ${index + 1}`}
            className={`object-cover w-full h-full ${index === 0 && 'rounded-tl-lg rounded-bl-lg'} ${index === 1 && 'rounded-tr-lg'} ${
              index === 2 && 'rounded-br-lg'
            }`}
          />
          {index === 2 && (
            <Link
              className='absolute inset-0 backdrop-blur-[2px] flex items-center justify-center rounded-br-lg'
              href={`/album/${albumOwner}/${albumTitle}`}
            >
              <Button>See All</Button>
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}

export default PostPreview
