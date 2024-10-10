import PasswordStrength from '@/components/PasswordStrength'
import React from 'react'
export default function Feed() {
  return (
    <div className='flex flex-col items-center gap-5'>
      <h1 className='text-center text-yellow-500 text-3xl font-bold'>Feed</h1>
      <PasswordStrength />
    </div>
  )
}
