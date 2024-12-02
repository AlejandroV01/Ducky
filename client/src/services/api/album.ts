// services/api/album.ts
import { fetchApi } from './base'
import { Album, AlbumMember } from '@/types/db'

export const albumApi = {
  // Album CRUD
  createAlbum: (token: string, data: { title: string; description: string; public: boolean }) =>
    fetchApi('/albums', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  getAllAlbums: (token: string) =>
    fetchApi('/albums', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getPaginatedAlbums: (token: string, page: number = 1, pageSize: number = 20) =>
    fetchApi(`/albums/paginated?page=${page}&page_size=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getMyAlbums: (token: string) =>
    fetchApi('/albums/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getUserAlbums: (token: string, userId: string) =>
    fetchApi(`/albums/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getAlbumById: (token: string, albumId: string) =>
    fetchApi(`/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  updateAlbum: (token: string, albumId: string, data: Partial<Album>) =>
    fetchApi(`/albums/${albumId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  deleteAlbum: (token: string, albumId: string) =>
    fetchApi(`/albums/${albumId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // Members
  joinAlbum: (token: string, albumId: string) =>
    fetchApi(`/albums/${albumId}/members/join`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getAlbumMembers: (token: string, albumId: string, page: number = 1, pageSize: number = 20) =>
    fetchApi(`/albums/${albumId}/members?page=${page}&page_size=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  updateMemberRole: (token: string, albumId: string, userId: string, role: string) =>
    fetchApi(`/albums/${albumId}/members/${userId}/role`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    }),

  removeMember: (token: string, albumId: string, userId: string) =>
    fetchApi(`/albums/${albumId}/members/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
}