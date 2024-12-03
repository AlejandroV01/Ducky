// services/api/albumMember.ts
import { fetchApi } from './base'

export const albumMemberApi = {
  // Join or request to join an album
  joinAlbum: (token: string, albumId: string) =>
    fetchApi(`/albums/${albumId}/members/join`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // Get join requests for an album (owner/admin only)
  getJoinRequests: (token: string, albumId: string, page: number = 1, pageSize: number = 20) =>
    fetchApi(`/albums/${albumId}/members/requests?page=${page}&page_size=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // Handle join request (owner/admin only)
  handleJoinRequest: (
    token: string, 
    albumId: string, 
    requestId: string, 
    data: { 
      status: 'approved' | 'rejected',
      role?: 'contributor' | 'viewer'
    }
  ) =>
    fetchApi(`/albums/${albumId}/members/requests/${requestId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  // Update member role
  updateMemberRole: (
    token: string, 
    albumId: string, 
    userId: string, 
    role: 'admin' | 'contributor' | 'viewer'
  ) =>
    fetchApi(`/albums/${albumId}/members/${userId}/role`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    }),

  // Remove member
  removeMember: (token: string, albumId: string, userId: string) =>
    fetchApi(`/albums/${albumId}/members/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // Get album members
  getMembers: (token: string, albumId: string, page: number = 1, pageSize: number = 20) =>
    fetchApi(`/albums/${albumId}/members?page=${page}&page_size=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
}