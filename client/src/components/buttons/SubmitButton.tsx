import { Button } from '@/components/ui/button'
import React from 'react'

type SubmitButtonProps = {
  text: string
  isLoading: boolean
}

export default function SubmitButton({ text, isLoading }: SubmitButtonProps) {
  return (
    <Button type='submit' disabled={isLoading} className='mt-3'>
      {text}
    </Button>
  )
}
