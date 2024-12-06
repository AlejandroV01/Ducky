'use client'
import PageWrapper from '@/components/PageWrapper'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import UserAvatar from '@/components/UserAvatar'
import { supabase } from '@/lib/supabaseClient'
import { useAppSelector } from '@/store/hooks'
import { Download, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
export default function AlbumCreate() {
  const currentUserName = 'peterparker'
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [albumTitle, setAlbumTitle] = useState('')
  const [albumDescription, setAlbumDescription] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [albumCreateError, setAlbumCreateError] = useState('')
  const router = useRouter()
  const user = useAppSelector(state => state.user.user)
  if (!user.user_name) {
    router.push('/auth')
  }
  //add member to table album_member
  // export interface AlbumMember {
  //   id: string
  //   album_id: string
  //   user_id: string
  //   role: MemberRole
  //   joined_at: string
  // }
  const otherPersonUserId = 'dce6513e-b19d-42e4-9730-19fa9efd60c9'
  const albumId = '2d91645d-dd06-4119-8bf3-4ebfe79aaa6f'
  const handleAddMember = () => {
    setIsAddingMember(true)

    const addMember = async () => {
      const { data, error } = await supabase.from('album_member').insert([
        {
          album_id: albumId,
          user_id: otherPersonUserId,
          role: 'viewer',
        },
      ])
      if (error) {
        console.error('Error adding member:', error)
        setErrorMessage('Member already added!')
        setIsAddingMember(false)
        throw error
      }
      console.log(data)
      setIsAddingMember(false)
      setErrorMessage('')
    }
    addMember()
  }
  //create an album
  // export interface Album {
  //   id: string
  //   title: string
  //   description: string
  //   public: boolean
  //   archived: boolean
  //   created_at: string
  //   updated_at?: string
  //   owner_id: string
  //   cover_photo_url?: string
  //   total_photos: number
  //   role?: MemberRole // Added when fetching album details
  // }

  const handleAddFiles = (incomingFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...incomingFiles])
  }
  const handleRemoveFile = (indexToRemove: number) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove))
  }
  const [albumCreateLoading, setAlbumCreateLoading] = useState(false)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setAlbumCreateLoading(true)
    console.log('making album with files', files)

    if (!albumTitle || !albumDescription || files.length === 0) {
      console.log('Here are the fields: ', albumTitle, albumDescription, files)
      setAlbumCreateError('Please fill in all the fields and add photos')
      return
    }

    if (files.length < 3) {
      setAlbumCreateError('Please add at least 3 photos')
      return
    }
    try {
      // Create the album in the database
      const { data: albumData, error: albumError } = await supabase
        .from('album')
        .insert([
          {
            title: albumTitle,
            description: albumDescription,
            public: true,
            archived: false,
            owner_id: user.id,
            total_photos: files.length,
          },
        ])
        .select() // Ensure you use `.select()` to return the inserted data

      if (albumError) {
        console.error('Error creating album:', albumError)
        setAlbumCreateError('Error creating album. Please try again.')
        return
      }

      console.log('Album created:', albumData)
      const albumId = albumData[0]?.id // Extract the album ID

      if (!albumId) {
        throw new Error('Album ID not returned from Supabase.')
      }

      // Insert the album owner into the album_member table
      const { error: memberError } = await supabase.from('album_member').insert([
        {
          album_id: albumId,
          user_id: otherPersonUserId,
          role: 'owner',
          joined_at: new Date().toISOString(),
        },
      ])

      if (memberError) {
        console.error('Error adding owner to album_member:', memberError)
        setAlbumCreateError('Error setting up album ownership. Please try again.')
        return
      }

      console.log('Owner added to album_member table.')

      const albumFolderPath = `Users/${user.user_name}/${albumTitle}/`

      // Ensure user folder exists
      const { error: userFolderError } = await supabase.storage.from('photos').upload(`${albumFolderPath}dummy.txt`, new Blob(['dummy']), {
        upsert: false,
      })

      if (userFolderError && userFolderError.message !== 'The resource already exists') {
        console.error('Error creating user folder:', userFolderError)
        setAlbumCreateError('Error setting up storage. Please try again.')
        return
      }

      // Remove dummy file (if created)
      await supabase.storage.from('photos').remove([`${albumFolderPath}dummy.txt`])

      // Upload files to album folder
      const uploadPromises = files.map(async (file, index) => {
        const { error: uploadError } = await supabase.storage.from('photos').upload(`${albumFolderPath}${file.name}`, file, {
          cacheControl: '3600',
          upsert: true,
        })

        if (uploadError) {
          console.error(`Error uploading file ${index + 1}:`, uploadError)
          throw uploadError
        }
      })

      await Promise.all(uploadPromises)

      console.log('Files uploaded successfully!')
      setAlbumCreateError('')
      setAlbumCreateLoading(false)
      router.push(`/album/${user.user_name}/${albumTitle}`)
    } catch (error) {
      console.error('Error during album creation and file upload:', error)
      setAlbumCreateError('Something went wrong. Please try again.')
    }
  }

  return (
    <PageWrapper>
      <div className='container max-w-[900px] flex flex-col gap-2 mt-16'>
        <h1 className='text-3xl font-bold mr-auto '>Create Album</h1>
        <div className='h-[2px] bg-foreground/50 w-full rounded-full' />
        <div className='flex gap-2 items-center'>
          <div className='flex-1'>
            <DropZoneBox handleAddFiles={handleAddFiles} currentFiles={files} />
          </div>
          <form action='' className='flex-1 flex flex-col h-full gap-10 py-6' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='albumTitle' className='font-semibold text-foreground/80'>
                Album Title
              </Label>
              <Input type='text' id='albumTitle' placeholder='Album Title' onChange={e => setAlbumTitle(e.target.value)} />
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='albumDescription' className='font-semibold text-foreground/80'>
                Album Description
              </Label>
              <Input type='text' id='albumDescription' placeholder='Album Description' onChange={e => setAlbumDescription(e.target.value)} />
            </div>
            {albumCreateError && <p className='text-destructive'>{albumCreateError}</p>}
            {albumCreateLoading ? (
              <Button disabled className='bg-primary/60'>
                <Loader2 className='animate-spin' />
                Publishing...
              </Button>
            ) : (
              <Button type='submit'>Publish Album</Button>
            )}
          </form>
        </div>
      </div>
      {files.length > 0 && (
        <div className='flex flex-col items-center my-4 w-full'>
          <h2 className='text-xl font-semibold my-4'>Picture Display:</h2>
          <Button onClick={() => setFiles([])} className='w-full max-w-[200px] my-3'>
            Clear All
          </Button>
          <div id='pictures' className='grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] mt-4 w-full gap-2 max-w-[1100px]'>
            {files.map((file, index) => (
              <div
                key={index}
                className='relative w-[200px] h-[200px] overflow-hidden border cursor-pointer'
                onClick={() => handleRemoveFile(index)} // Delete file on click
              >
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Uploaded ${index + 1}`}
                  width={200}
                  height={200}
                  className='object-cover w-full h-full'
                />
                <p className='absolute top-0 right-0 bg-primary text-black text-xs p-1 rounded-bl-lg'>Click to Delete</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageWrapper>
  )
}

const DropZoneBox = ({ handleAddFiles, currentFiles }: { handleAddFiles: (files: File[]) => void; currentFiles: File[] }) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpg': [],
      'image/png': [],
      'image/jpeg': [],
      'image/gif': [],
    },
  })
  useEffect(() => {
    handleAddFiles(acceptedFiles as File[])
  }, [acceptedFiles])
  return (
    <section>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <div className='flex bg-secondary/40 rounded-lg border h-[400px] justify-center items-center'>
          <div className='flex flex-col gap-1 items-center'>
            <Download size={55} />
            <p className='max-w-[200px] font-semibold text-lg text-center'>Drag or enter your photos here</p>
            {acceptedFiles.length > 0 && <p className='max-w-[200px] font-semibold text-lg text-center'>{currentFiles.length} Photos</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
