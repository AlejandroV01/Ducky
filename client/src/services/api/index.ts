import { authApi } from './auth'
import { userApi } from './user'
import { albumApi } from './album'

export const api = {
  auth: authApi,
  user: userApi,
  album: albumApi,
}