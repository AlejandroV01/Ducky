'use client'
import { ModeToggle } from '@/components/ModeToggle'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'
import { useState } from 'react'
export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGet = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/user', { method: 'GET' })
      if (!res.ok) throw new Error('Failed to fetch')
      console.log(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckUser = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'johndoe' }),
      })
      if (!res.ok) throw new Error('Failed to fetch')
      console.log(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInsert = async () => {
    setIsLoading(true)
    const newUser = {
      first_name: 'Lebron',
      last_name: 'James',
    }
    try {
      const res = await fetch('http://127.0.0.1:8000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Add this line
        },
        body: JSON.stringify(newUser),
      })
      if (!res.ok) throw new Error('Failed to fetch')
      console.log(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetUser = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/users/92ff0041-eef8-4afd-a913-413076111af9', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!res.ok) throw new Error('Failed to fetch')
      console.log(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center gap-10'>
      <h1 className='text-yellow-600 text-3xl font-bold text-center'>Welcome to Ducky</h1>
      <ModeToggle />
      <Button className='flex items-center justify-center gap-1' onClick={handleGet} disabled={isLoading}>
        <span>Get Users</span>
        {isLoading && <Loader className='animate-spin' size={16} />}
      </Button>
      <Button className='flex items-center justify-center gap-1' onClick={handleInsert} disabled={isLoading}>
        <span>Insert Users</span>
        {isLoading && <Loader className='animate-spin' size={16} />}
      </Button>
      <Button className='flex items-center justify-center gap-1' onClick={handleCheckUser} disabled={isLoading}>
        <span>Check johndoe</span>
        {isLoading && <Loader className='animate-spin' size={16} />}
      </Button>
      <Button className='flex items-center justify-center gap-1' onClick={handleGetUser} disabled={isLoading}>
        <span>Get Ducky</span>
        {isLoading && <Loader className='animate-spin' size={16} />}
      </Button>
    </div>
  )
}
