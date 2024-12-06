'use client'
import { useAppDispatch } from '@/store/hooks'
import { signOut } from '@/store/state/auth.slice'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
const Logout = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const handleLogout = () => {
    dispatch(signOut())
    router.push('/')
  }
  //<Button onClick={handleLogout}>Logout</Button>
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Logout</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to logout?</p>
        <Button onClick={handleLogout}>Logout</Button>
      </DialogContent>
    </Dialog>
  )
}

export default Logout
