"use client"
import { signOut } from '@/store/state/auth.slice'
import { useAppDispatch } from '@/store/hooks'

const Logout = () => {
    const dispatch = useAppDispatch()
    
    const handleLogout = () => {
        dispatch(signOut())
    }
    
    return (
        <button className="p-2 text-lg w-[150px] bg-slate-800" onClick={handleLogout}>Logout</button>
    )

}

export default Logout