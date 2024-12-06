'use client'
import { Progress } from '@/components/ui/progress'
import { Check, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const PasswordStrength = ({ password }: { password: string }) => {
  const [progressValue, setProgressValue] = useState<number>(0)

  function containsSpecialChar(password: string): boolean {
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/
    return specialCharPattern.test(password)
  }
  function calculateStrength(password: string): number {
    let strength = 0

    if (password.length >= 6) strength += 33.3
    if (/[0-9]/.test(password)) strength += 33.3
    if (containsSpecialChar(password)) strength += 33.3
    return strength
  }

  useEffect(() => {
    setProgressValue(calculateStrength(password))
  }, [password])

  function strengthLevel(strength: number): {
    level: string
    textColor: string
  } {
    if (strength <= 34) {
      return { level: 'Weak', textColor: 'text-red-500' }
    } else if (strength <= 67) {
      return { level: 'Moderate', textColor: 'text-yellow-500' }
    } else {
      return { level: 'Strong', textColor: 'text-green-500' }
    }
  }
  const { level, textColor } = strengthLevel(progressValue)

  return (
    <div className='flex flex-col gap-[0.305rem]'>
      <Progress className='[&>*]:bg-[#8B6ED4] h-[12px]' value={progressValue} />
      <h1 className={`font-semibold flex items-center gap-2`}>
        Password Strength: <span className={`${textColor}`}>{level}</span>
      </h1>
      <h1 className='font-semibold'>Your password must contain:</h1>
      <div className='flex flex-col gap-0'>
        <div className='flex items-center'>
          {password.length >= 6 ? <Check size={20} className='text-[#14B8A6]' /> : <X size={20} className='text-neutral-700' />}
          <p className={password.length >= 6 ? 'text-[#14B8A6]' : 'text-neutral-700'}>Password is at least 6 characters:</p>
        </div>

        <div className='flex items-center'>
          {/[0-9]/.test(password) ? <Check size={20} className='text-[#14B8A6]' /> : <X size={20} className='text-neutral-700' />}
          <p className={/[0-9]/.test(password) ? 'text-[#14B8A6]' : 'text-neutral-700'}>Contains one Number</p>
        </div>

        <div className='flex items-center'>
          {containsSpecialChar(password) ? <Check size={20} className='text-[#14B8A6]' /> : <X size={20} className='text-neutral-700' />}
          <p className={containsSpecialChar(password) ? 'text-[#14B8A6]' : 'text-neutral-700'}>Contains one Special Character</p>
        </div>
      </div>
    </div>
  )
}

export default PasswordStrength
