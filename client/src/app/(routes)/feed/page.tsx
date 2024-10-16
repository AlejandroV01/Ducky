'use client'
import PasswordStrength from '@/components/PasswordStrength'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
export default function Feed() {
  const [password, setPassword] = useState<string>('')

  return (
    <div className='flex flex-col items-center gap-5'>
      <h1 className='text-center text-yellow-500 text-3xl font-bold'>Feed</h1>
      <Input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Enter Your Password' />
      <PasswordStrength password={password} />
    </div>
  )
}
