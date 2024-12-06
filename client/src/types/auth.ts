export interface SignUpData {
  email: string
  password: string
  first_name: string
  last_name: string
  user_name: string
}

export interface SignInData {
  email: string
  password: string
}

export interface VerificationData {
  email: string
  code: string
}

export interface AlbumMemberUser {
  role: 'owner' | 'admin' | 'contributor' | 'viewer'
  user: {
    id: string
    user_name: string
    email: string
    icon_url: string | null
  }
}
