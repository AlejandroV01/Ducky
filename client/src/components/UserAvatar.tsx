/* eslint-disable @next/next/no-img-element */
import { useAppSelector } from '@/store/hooks'
import React, { useEffect, useState } from 'react'
import { Avatar } from './ui/avatar'
const UserAvatar = () => {
  const userName = useAppSelector(state => state.auth.user_name)
  const [avatarUrl, setAvatarUrl] = useState<string>('https://placehold.co/100')

  useEffect(() => {
    if (userName) {
      const imageUrl = `https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=${userName}&backgroundColor=ffffff,ffdfbf,c0aede,d1d4f9,ffd5dc,b6e3f4`

      fetch(imageUrl)
        .then(response => {
          if (response.ok) {
            setAvatarUrl(imageUrl)
          } else {
            setAvatarUrl('https://placehold.co/100')
          }
        })
        .catch(() => {
          setAvatarUrl('https://placehold.co/100')
        })
    }
  }, [userName])

  return (
    <Avatar>
      <img src={avatarUrl} alt={`${userName}'s avatar`} className='w-full h-full object-cover' />
    </Avatar>
  )
}

export default UserAvatar
