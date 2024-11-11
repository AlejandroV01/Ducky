'use client'
import PageWrapper from '@/components/PageWrapper'
import { Post } from '@/components/Post/Post'
export default function Home() {
  // const [isLoading, setIsLoading] = useState(false)

  // const handleGet = async () => {
  //   setIsLoading(true)
  //   try {
  //     const res = await fetch('http://127.0.0.1:8000/user', { method: 'GET' })
  //     if (!res.ok) throw new Error('Failed to fetch')
  //     console.log(await res.json())
  //   } catch (err) {
  //     console.error(err)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // const handleCheckUser = async () => {
  //   setIsLoading(true)
  //   try {
  //     const res = await fetch('http://127.0.0.1:8000/check-user', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ username: 'johndoe' }),
  //     })
  //     if (!res.ok) throw new Error('Failed to fetch')
  //     console.log(await res.json())
  //   } catch (err) {
  //     console.error(err)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // const handleInsert = async () => {
  //   setIsLoading(true)
  //   const newUser = {
  //     first_name: 'Lebron',
  //     last_name: 'James',
  //   }
  //   try {
  //     const res = await fetch('http://127.0.0.1:8000/user', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json', // Add this line
  //       },
  //       body: JSON.stringify(newUser),
  //     })
  //     if (!res.ok) throw new Error('Failed to fetch')
  //     console.log(await res.json())
  //   } catch (err) {
  //     console.error(err)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // const handleGetUser = async () => {
  //   setIsLoading(true)
  //   try {
  //     const res = await fetch('http://127.0.0.1:8000/users/92ff0041-eef8-4afd-a913-413076111af9', {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //     if (!res.ok) throw new Error('Failed to fetch')
  //     console.log(await res.json())
  //   } catch (err) {
  //     console.error(err)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  return (
    <PageWrapper className='gap-8'>
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
    </PageWrapper>
  )
}
