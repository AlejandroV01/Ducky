import { Button } from "@/components/ui/button"

type SubmitButtonProps = {
  text: string
}

export default function SubmitButton({ text }: SubmitButtonProps) {
  return (
    <Button type="submit" variant="outline" className="w-[50%]">
      {text}
    </Button>
  )
} 