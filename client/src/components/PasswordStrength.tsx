import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Check, X } from 'lucide-react'
import React from 'react'
const PasswordStrength = () => {
  return (
    <div>
      <h1>PasswordStrength</h1>
      <Progress value={33} />
      <Input />
      <X size={50} className='text-green-500' />
      <Check />
    </div>
  )
}

export default PasswordStrength
