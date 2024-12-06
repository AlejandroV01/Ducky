'use client'
import PageWrapper from '@/components/PageWrapper'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { default as UserAvatar } from '@/components/UserAvatar'
import { supabase } from '@/lib/supabaseClient'
import { Album, User } from '@/types/db'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface MemberDataFormat {
  role: string
  user: {
    id: string
    user_name: string
    email: string
    icon_url?: string
  }
}
const AlbumPage = () => {
  const params = useParams()
  const userName = params.userName as string
  const albumTitle = decodeURIComponent(params.albumTitle as string)
  const [currentAlbum, setCurrentAlbum] = useState<Album>()
  const [members, setMembers] = useState<MemberDataFormat[]>([])
  const [errorLoadingAlbum, setErrorLoadingAlbum] = useState(false)
  const [sortOrder, setSortOrder] = useState<'oldest' | 'newest'>('newest')
  const [loadingImages, setLoadingImages] = useState(true)
  const [userAdmin, setUserAdmin] = useState<User>()
  const getUserFromUsername = () => {
    // Get user name from user ID
    const getUserFromUsernameSupabase = async () => {
      const { data, error } = await supabase.from('user').select('*').eq('user_name', userName)

      if (error) {
        console.error('Error fetching user name:', error)
        setErrorLoadingAlbum(true)
        throw error
      }
      const user = data[0]
      if (!user) {
        setErrorLoadingAlbum(true)
        return
      }
      setUserAdmin(user as User)
      return user
    }
    return getUserFromUsernameSupabase()
  }

  const getAlbumData = async (user_id: string) => {
    console.log('going to search for album with title:', albumTitle)
    console.log('going to search for album with owner_id:', user_id)
    const { data, error } = await supabase.from('album').select('*').eq('title', albumTitle).eq('owner_id', user_id)
    console.log('getAlbumData, data: ', data)
    console.log('getAlbumData, error: ', error)
    if (error) {
      console.error('Error fetching album data:', error)
      setErrorLoadingAlbum(true)
      throw error
    }
    if (data.length === 0) {
      setErrorLoadingAlbum(true)
      return
    }
    console.log(data[0])
    setCurrentAlbum(data[0] as Album)
    return data[0]
  }

  const getAlbumMembers = async (currentAlbumId: string) => {
    const { data, error } = await supabase
      .from('album_member') // Table containing roles
      .select('role, user:user_id(id, user_name, email, icon_url)') // Correct table name is 'user'
      .eq('album_id', currentAlbumId)

    if (error) {
      console.error('Error fetching album members:', error)
      setErrorLoadingAlbum(true)
      throw error
    }
    console.log('Album members:', data)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedData = data.map((member: any) => ({
      role: member.role,
      user: {
        id: member.user.id,
        user_name: member.user.user_name,
        email: member.user.email,
        icon_url: member.user.icon_url,
      },
    }))
    setMembers(formattedData as MemberDataFormat[])
    return data
  }

  const [albumImages, setAlbumImages] = useState<string[]>([])
  const getAlbumImages = async () => {
    try {
      setLoadingImages(true) // Start loading
      const albumFolderPath = `Users/${userName}/${albumTitle}/`

      const { data: files, error } = await supabase.storage.from('photos').list(albumFolderPath, {
        limit: 100,
      })

      if (error) {
        console.error('Error fetching album images:', error)
        setErrorLoadingAlbum(true)
        return
      }

      if (!files || files.length === 0) {
        console.log('No images found in album.')
        setAlbumImages([])
        return
      }

      const sortedFiles = files.sort((a, b) => {
        if (sortOrder === 'oldest') {
          return new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime()
        }
        return new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
      })

      const publicURLs = sortedFiles.map(file => supabase.storage.from('photos').getPublicUrl(`${albumFolderPath}${file.name}`).data.publicUrl)

      setAlbumImages(publicURLs)
      console.log('Album images retrieved:', publicURLs)
    } catch (error) {
      console.error('Error retrieving album images:', error)
      setErrorLoadingAlbum(true)
    } finally {
      setLoadingImages(false) // End loading
    }
  }

  useEffect(() => {
    getUserFromUsername().then(user => {
      if (!user || !user.id) {
        console.error('User not found')
        return
      } else {
        console.log('User found: ', user.id)
      }
      getAlbumData(user.id).then(albumData => {
        if (!albumData) {
          console.error('Album not found')
          return
        } else {
          console.log('Album found: ', albumData)
        }
        getAlbumMembers(albumData.id)
        getAlbumImages()
      })
    })
  }, [])

  console.log(members)

  if (errorLoadingAlbum) {
    return (
      <PageWrapper>
        <div>Error loading album</div>
        <Link href='/'>
          <Button>Home</Button>
        </Link>
      </PageWrapper>
    )
  }
  if (!currentAlbum)
    return (
      <PageWrapper>
        <div>Loading...</div>
      </PageWrapper>
    )
  return (
    <PageWrapper>
      <div className='flex items-center justify-between w-full'>
        <div className='flex flex-col gap-2 items-center flex-1 text-center'>
          <h1 className='text-2xl font-bold'>{albumTitle}</h1>
          <div className='flex items-center gap-2'>
            <UserAvatar size={30} username={userAdmin?.user_name} icon_url={userAdmin?.icon_url ?? undefined} />
            <Link className='hover:underline font-semibold' href={`/profile/${userName}`}>
              {userName}
            </Link>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Manage Members</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {albumTitle} Members ({members.length})
                </DialogTitle>
              </DialogHeader>
              {members.map((member: MemberDataFormat, index) => {
                if (members.length === 0) return <DialogDescription key={index}>No members</DialogDescription>
                return (
                  <div key={index} className='flex items-center gap-2 justify-between'>
                    <div className='flex items-center gap-2'>
                      <UserAvatar size={30} username={member.user.user_name} />
                      <Link href={`/profile/${member.user.user_name}`} className='hover:underline'>
                        {member.user.user_name}
                      </Link>
                    </div>
                    <Select defaultValue={member.role}>
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue>{member.role}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='admin'>Admin</SelectItem>
                        <SelectItem value='contributor'>Contributor</SelectItem>
                        <SelectItem value='viewer'>Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )
              })}
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <Select
            value={sortOrder}
            onValueChange={value => {
              setSortOrder(value as 'oldest' | 'newest')
              getAlbumImages()
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='Sort by' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='oldest'>Oldest</SelectItem>
              <SelectItem value='newest'>Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-2 mt-4 w-full max-w-[1250px] px-10 place-items-center'>
        {loadingImages ? (
          Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className='w-[250px] h-[250px] rounded-lg' />)
        ) : albumImages && albumImages.length > 0 ? (
          albumImages.map((src, index) => (
            <div key={index} className='relative w-[250px] h-[250px] overflow-hidden border-2 border-foreground/5 rounded-lg cursor-pointer'>
              <Dialog>
                <DialogTrigger className='w-full h-full'>
                  <Image
                    src={src}
                    alt={`Album Image ${index + 1}`}
                    width={250}
                    height={250}
                    sizes='250px' // Hint for responsive sizes
                    quality={90} // Adjust quality to improve clarity
                    className='object-contain w-full h-full'
                  />
                </DialogTrigger>
                <DialogContent className='p-12'>
                  <Image src={src} alt={`Album Image ${index + 1}`} width={1000} height={1000} className='object-cover w-full h-full' />
                </DialogContent>
              </Dialog>
            </div>
          ))
        ) : (
          <p>No images found in this album.</p>
        )}
      </div>
    </PageWrapper>
  )
}
export default AlbumPage
