/* eslint-disable @next/next/no-img-element */
import { supabase } from '@/lib/supabaseClient'
import { Album, User } from '@/types/db'
import { CheckCircle, LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import UserAvatar from '../UserAvatar'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
export const Post = ({ albumData }: { albumData: Album }) => {
  const [user, setUser] = useState<User>()
  const userId = albumData.owner_id
  const [loading, setLoading] = useState(true)
  const date = new Date(albumData.created_at).toLocaleDateString('en-US', {
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
  //use the user table to get the user_name of the id
  const getUserBasedOnId = async () => {
    const { data, error } = await supabase.from('user').select('*').eq('id', userId)
    if (error) {
      console.error('Error getting user name from id', error)
      return
    }
    setUser(data[0] as User)
  }
  useEffect(() => {
    getUserBasedOnId()
  }, [])
  useEffect(() => {
    console.log('current loading of Post:', loading)
  }, [loading])

  const handleToggleLoading = (isLoading: boolean) => {
    setLoading(isLoading)
  }
  const userName = user?.user_name
  console.log('Post', albumData.title, 'by', userName, 'icon_url', user?.icon_url)
  console.info('USER for Post', albumData.title, 'IS', user)
  return (
    <Card className='max-w-[550px] p-4 dark:bg-foreground/5 rounded-lg shadow-md flex flex-col min-w-[550px]'>
      <Link className='flex items-center gap-2 mb-2 hover:underline w-fit' href={`/profile/${userName}`}>
        <UserAvatar size={30} username={userName} icon_url={user?.icon_url ?? undefined} />
        <span className='font-semibold'>{userName}</span>
      </Link>
      <div>
        <Link className='block text-xl font-semibold mb-2 hover:underline' href={`/album/${userName}/${albumData.title}`}>
          {albumData.title}
        </Link>
        {loading && <Skeleton className='w-[516px] h-[361px]' />}
        {userName && <PostPreview albumOwner={userName} albumTitle={albumData.title} handleToggleLoading={handleToggleLoading} />}

        <div className='flex flex-wrap items-start gap-2 mt-4'>
          <p className='flex-1 min-w-0 break-all'>
            <Link className='font-semibold hover:underline' href={`/profile/${userName}`}>
              {userName}:
            </Link>{' '}
            {albumData.description}
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

const PostPreview = ({
  albumTitle,
  albumOwner,
  handleToggleLoading,
}: {
  albumTitle: string
  albumOwner: string
  handleToggleLoading: (loading: boolean) => void
}) => {
  const [albumImages, setAlbumImages] = useState<string[]>([])

  const getAlbumImages = async () => {
    try {
      console.log('Fetching album images... from album:', albumTitle, 'by user:', albumOwner)
      console.log(`Users/${albumOwner}/${albumTitle}/`)
      const albumFolderPath = `Users/${albumOwner}/${albumTitle}/`

      const { data: files, error } = await supabase.storage.from('photos').list(albumFolderPath, {
        limit: 3,
      })

      if (error) {
        console.error('Error fetching album images:', error)
        return
      }

      if (!files || files.length === 0) {
        console.log('No images found in album.')
        setAlbumImages([])
        return
      }

      const publicURLs = files.map(file => supabase.storage.from('photos').getPublicUrl(`${albumFolderPath}${file.name}`).data.publicUrl)

      setAlbumImages(publicURLs)
      console.log('Album images retrieved:', publicURLs)
    } catch (error) {
      console.error('Error retrieving album images:', error)
    } finally {
      handleToggleLoading(false)
    }
  }

  useEffect(() => {
    handleToggleLoading(true)
    getAlbumImages()
  }, [albumOwner])

  return (
    <div className='grid gap-1 grid-cols-2 grid-rows-2 border rounded-lg max-h-[365px]'>
      {albumImages.map((url, index) => (
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
