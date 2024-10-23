import { User } from '@/types/db'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState: User = {
  id: '',
  email: '',
  first_name: '',
  last_name: '',
  user_name: '',
  icon_url: '',
  created_on: '',
}

export const authSlice = createSlice({
  name: 'auth-state',
  initialState,
  reducers: {
    addProfile: (state, action: PayloadAction<User>) => {
      return {
        ...state,
        ...action.payload,
      }
    },
    removeProfile: () => initialState,
  },
})

export const { addProfile, removeProfile } = authSlice.actions

export default authSlice.reducer
