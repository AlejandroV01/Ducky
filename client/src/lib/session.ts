import { refreshSession } from '../store/state/auth.slice'
import { AppDispatch } from '../store/store'

// automatically refresh the session 2 minutes before the access token expires
export const persistSession = (expiresIn: number, dispatch: AppDispatch) => {
  const refreshTime = expiresIn - 2 * 60 * 1000 // access token expiration time minus 2 minutes

  // refresh the session 2 minutes before the access token expires
  setTimeout(() => {
    dispatch(refreshSession())
  }, refreshTime)
}