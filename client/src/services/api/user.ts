import { fetchApi } from './base'
import { User } from '@/types/db'

export const userApi = {
  getMe: (token: string) =>
    fetchApi('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  updateProfile: (token: string, data: Partial<User>) =>
    fetchApi('/users/me', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  updatePassword: (token: string, data: { current_password: string, new_password: string }) =>
    fetchApi('/users/me/password', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),
}