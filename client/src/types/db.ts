// User table
export interface User {
  id: string // UUID
  email: string
  first_name: string
  last_name: string
  user_name: string
  icon_url: string | null
  is_verified: boolean
  auth_provider?: 'google' | 'email'
  last_login?: string // ISO timestamp with time zone
  created_at?: string // ISO timestamp with time zone
  login_attempts?: number
  last_failed_login?: string // ISO timestamp with time zone
}

// types/db.ts
export interface Album {
  id: string
  title: string
  description: string
  public: boolean
  archived: boolean
  created_at: string
  updated_at?: string
  owner_id: string
  cover_photo_url?: string
  total_photos: number
  role?: MemberRole // Added when fetching album details
}

export enum MemberRole {
  OWNER = "owner",
  ADMIN = "admin",
  CONTRIBUTOR = "contributor",
  VIEWER = "viewer"
}

export interface AlbumMember {
  id: string
  album_id: string
  user_id: string
  role: MemberRole
  joined_at: string
}

export interface JoinRequest {
  id: string
  album_id: string
  user_id: string
  status: 'pending' | 'approved' | 'rejected'
  requested_at: string
  processed_at?: string
  processed_by?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  page_size: number
}

// AlbumRole table
export interface AlbumRole {
  id: number // bigint
  user_id: string // UUID
  album_id: string // UUID
  role: 'owner' | 'editor' | 'viewer' | 'none' // Assuming USER-DEFINED type in Postgres; you may replace 'any' with an enum or specific type
}

// Photo table
export interface Photo {
  id: string // UUID
  url: string
  caption: string
  created_at: string // ISO timestamp with time zone
  album_id: string // UUID
}
