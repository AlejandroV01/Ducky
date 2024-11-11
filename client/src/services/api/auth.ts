import { SignInData, SignUpData, VerificationData } from '@/types/auth'
import { fetchApi } from './base'

export const authApi = {
  signUp: (data: SignUpData) => 
    fetchApi('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyEmail: (data: VerificationData) =>
    fetchApi('/verification/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resendCode: (email: string) =>
    fetchApi('/verification/resend', {
      method: 'POST',
      body: JSON.stringify({email}),
    }),

  signIn: (data: SignInData) =>
    fetchApi('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  signOut: () =>
    fetchApi('/auth/signout', {
      method: 'POST',
    }),

  refreshSession: () =>
    fetchApi('/auth/refresh', {
      method: 'POST',
    }),

  googleCallback: (code: string) =>
    fetchApi('/auth/google/callback', {
        method: 'POST',
        body: JSON.stringify({code}),
    }),
}