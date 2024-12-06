'use client'
import Logout from '@/components/LogoutButton'
import PageWrapper from '@/components/PageWrapper'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import UserAvatar from '@/components/UserAvatar'
import { supabase } from '@/lib/supabaseClient'
import { useAppSelector } from '@/store/hooks'
import { Album, User } from '@/types/db'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
interface Profile {
  params: {
    profileId: string
  }
}

const Profile = ({ params }: Profile) => {
  const { profileId } = params
  const username = profileId
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const storeUser = useAppSelector(state => state.user.user)
  const [user, setUser] = useState<User>()
  const fetchAlbums = async (id: string) => {
    try {
      const { data, error } = await supabase.from('album').select('*').order('created_at', { ascending: false }).eq('owner_id', id)

      if (error) {
        console.error('Error fetching albums:', error)
        return
      }

      setAlbums(data as Album[])
    } catch (error) {
      console.error('Unexpected error fetching albums:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUserBasedOnUsername = async () => {
    try {
      const { data, error } = await supabase.from('user').select('*').eq('user_name', username)
      if (error) {
        console.error('Error getting user ID from username:', error)
        return
      }
      if (data && data.length > 0) {
        setUser(data[0] as User)
        return data[0]
      }
    } catch (error) {
      console.error('Unexpected error fetching user ID:', error)
    }
    return null
  }

  useEffect(() => {
    getUserBasedOnUsername().then(user => {
      if (user) {
        fetchAlbums(user.id)
      }
    })
  }, [])

  const getAlbumImages = async (albumTitle: string, albumOwner: string) => {
    try {
      const albumFolderPath = `Users/${albumOwner}/${albumTitle}/`

      const { data: files, error } = await supabase.storage.from('photos').list(albumFolderPath, {
        limit: 1,
      })

      if (error || !files || files.length === 0) {
        return '/placeholder.jpg' // Use a placeholder image if no images are found
      }

      return supabase.storage.from('photos').getPublicUrl(`${albumFolderPath}${files[0].name}`).data.publicUrl
    } catch (error) {
      console.error('Error fetching album image:', error)
      return '/placeholder.jpg'
    }
  }

  return (
    <PageWrapper>
      <div className='flex flex-col gap-6 w-full max-w-[1000px] mt-10'>
        <div className='flex items-center gap-4'>
          <UserAvatar username={username} size={50} icon_url={user?.icon_url ?? undefined} />
          <h2 className='font-semibold text-2xl'>{username}</h2>
          {storeUser.user_name === username && (
            <div className='ml-auto'>
              <Logout />
            </div>
          )}
        </div>
        <div className='w-full h-1 bg-border rounded-full' />
        <div className='grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-2 place-items-center'>
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className='w-full h-[250px] rounded-lg' />)
            : albums.map(album => <AlbumCard key={album.id} album={album} albumOwner={username} getAlbumImages={getAlbumImages} />)}
          {!loading && albums.length === 0 && (
            <div className='text-center text-muted flex flex-col gap-2'>
              <p className='font-semibold text-2xl'>No albums found</p>
              <Link href={'/album/create'}>
                <Button>Create an Album</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}

const AlbumCard = ({
  album,
  albumOwner,
  getAlbumImages,
}: {
  album: Album
  albumOwner: string
  getAlbumImages: (albumTitle: string, albumOwner: string) => Promise<string>
}) => {
  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
    getAlbumImages(album.title, albumOwner).then(setImage)
  }, [album.title, albumOwner])

  return (
    <Link href={`/album/${albumOwner}/${album.title}`} className='block'>
      <div className='flex flex-col bg-primary/30 rounded-lg shadow-md overflow-hidden max-w-[350px] min-w-[350px]'>
        <div className='h-[200px] w-full'>
          {image ? <img src={image} alt={album.title} className='w-full h-full object-cover' /> : <Skeleton className='w-full h-full' />}
        </div>
        <div className='p-4 flex flex-col gap-2'>
          <h3 className='font-semibold text-lg'>{album.title}</h3>
          <span className='text-sm text-muted'>
            {new Date(album.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <Button className='mt-2'>View Album</Button>
        </div>
      </div>
    </Link>
  )
}

export default Profile
