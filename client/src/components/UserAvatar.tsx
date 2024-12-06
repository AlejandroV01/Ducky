/* eslint-disable @next/next/no-img-element */
import { useAppSelector } from '@/store/hooks'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarImage } from './ui/avatar'

interface UserAvatarProps {
  size?: number
  username?: string
  icon_url?: string
}

const UserAvatar: React.FC<UserAvatarProps> = ({ size, icon_url, username }) => {
  const user = useAppSelector(state => state.user.user)
  const [avatarUrl, setAvatarUrl] = useState<string>('https://placehold.co/100')
  const displayName = username || user?.user_name // Use the username prop if provided, otherwise fallback to user.user_name
  console.log('UserAvatarProps: size, icon_url, username', size, icon_url, username)
  useEffect(() => {
    if (icon_url && icon_url.trim() !== '') {
      // Priority 1: Use the provided icon_url prop if valid
      setAvatarUrl(icon_url)
    } else if (username) {
      // Priority 2: Generate avatar for the provided username prop
      const imageUrl = `https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=${username}&backgroundColor=ffffff,ffdfbf,c0aede,d1d4f9,ffd5dc,b6e3f4`

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
    } else if (user?.icon_url && user.icon_url.trim() !== '') {
      // Priority 3: Use the user's icon_url from state if valid
      setAvatarUrl(user.icon_url)
    } else {
      // Fallback: Generate avatar for the user's user_name from state
      const imageUrl = `https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=${user.user_name}&backgroundColor=ffffff,ffdfbf,c0aede,d1d4f9,ffd5dc,b6e3f4`

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
  }, [icon_url, username, user?.icon_url, user?.user_name])

  return (
    <Avatar className={`w-full ${size ? '' : 'h-full'} rounded-full border border-foreground`} style={size ? { width: size, height: size } : {}}>
      <AvatarImage src={avatarUrl} alt={`${displayName}'s avatar`} className='w-full h-full object-cover rounded-full' />
    </Avatar>
  )
}

export default UserAvatar
