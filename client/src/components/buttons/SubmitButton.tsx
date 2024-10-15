import { Button } from "@/components/ui/button"
import React from "react"

type SubmitButtonProps = {
  text: string
  pixelWidth: number
  pixelHeight: number
}

export default function SubmitButton({ text, pixelWidth, pixelHeight }: SubmitButtonProps) {
  return (
    <Button 
      type="submit" 
      className="bg-ducky-btn text-md font-semibold text-black hover:bg-ducky-hover transition-colors duration-200"
      style={{ 
        width: `${pixelWidth}px`, 
        height: `${pixelHeight}px`,
        border: 'none',
        outline: 'none'
      }}
    >
      {text}
    </Button>
  )
}