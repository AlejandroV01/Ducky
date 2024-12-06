'use client'
import PageWrapper from '@/components/PageWrapper'
import { Post } from '@/components/Post/Post'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabaseClient'
import { Album } from '@/types/db'
import { useEffect, useState } from 'react'

export default function Home() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAlbums = async () => {
    try {
      const { data, error } = await supabase.from('album').select('*').order('created_at', { ascending: false })

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

  useEffect(() => {
    fetchAlbums()
  }, [])

  if (loading) {
    return (
      <PageWrapper className='gap-8'>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className='w-[550px] h-[543px]' />
        ))}
      </PageWrapper>
    )
  }

  if (albums.length === 0) {
    return (
      <PageWrapper className='gap-8'>
        <p>No albums found.</p>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper className='gap-8'>
      {albums.map(album => (
        <Post key={album.id} albumData={album} />
      ))}
    </PageWrapper>
  )
}
