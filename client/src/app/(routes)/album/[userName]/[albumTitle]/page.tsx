'use client'
import PageWrapper from '@/components/PageWrapper'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import UserAvatar from '@/components/UserAvatar'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const images = Array.from({ length: 7 }, (_, i) => `/images/Portrait${i + 1}.svg`)

const AlbumPage = () => {
  const params = useParams()
  const userName = params.userName as string
  const albumTitle = decodeURIComponent(params.albumTitle as string)
  const albumAdminUser = 'peterparker'

  return (
    <PageWrapper>
      <div className='flex items-center justify-between w-full'>
        <div className='flex flex-col gap-2 items-center flex-1 text-center'>
          <h1 className='text-2xl font-bold'>{albumTitle}</h1>
          <div className='flex items-center gap-2'>
            <UserAvatar size={30} username={albumAdminUser} />
            <Link className='hover:underline font-semibold' href={`/profile/${userName}`}>
              {userName}
            </Link>
          </div>
        </div>
        <div>
          <Select>
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

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
        {images.map((src, index) => (
          <Image key={index} src={src} alt={`Portrait ${index + 1}`} width={300} height={300} />
        ))}
      </div>
    </PageWrapper>
  )
}

export default AlbumPage
