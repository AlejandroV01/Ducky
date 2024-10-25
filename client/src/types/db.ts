// Album table
export interface Album {
  id: string // UUID
  created_at: string // ISO timestamp with time zone
  title: string
  admin_id: string // UUID
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

// User table
export interface User {
  id: string // UUID
  email: string
  first_name: string
  last_name: string
  user_name: string
  icon_url: string
  created_on: string // ISO timestamp with time zone
}
