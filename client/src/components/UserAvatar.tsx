/* eslint-disable @next/next/no-img-element */
import { useAppSelector } from '@/store/hooks'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarImage } from './ui/avatar'

interface UserAvatarProps {
  size?: number
  username?: string
}

const UserAvatar: React.FC<UserAvatarProps> = ({ size }) => {
  const { user } = useAppSelector(state => state.user)
  const [avatarUrl, setAvatarUrl] = useState<string>('https://placehold.co/100')

  useEffect(() => {
    if (user.icon_url) {
      setAvatarUrl(user.icon_url)
    } else {
      const imageUrl = `https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=${user.icon_url}&backgroundColor=ffffff,ffdfbf,c0aede,d1d4f9,ffd5dc,b6e3f4`

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
  }, [user.icon_url])

  return (
    <Avatar className={`w-full ${size ? '' : 'h-full'} rounded-full border border-foreground`} style={size ? { width: size, height: size } : {}}>
      <AvatarImage src={avatarUrl} alt={`${user.user_name}'s avatar`} className='w-full h-full object-cover rounded-full' />
    </Avatar>
  )
}

export default UserAvatar
