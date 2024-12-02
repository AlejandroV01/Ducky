import { fetchApi } from './base'
import { User } from '@/types/db'

export const userApi = {
  getMe: (token: string) =>
    fetchApi('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getAllUsers: (token: string) => 
    fetchApi('/users/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getPaginatedUsers: (token: string, page: number, limit: number) => 
    fetchApi(`/users/?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getUserById: (token: string, id: string) => 
    fetchApi(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  updateUser: (token: string, id:string, data: Partial<User>) =>
    fetchApi(`/users/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  deleteUser: (token: string, id: string) =>
    fetchApi(`/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
}