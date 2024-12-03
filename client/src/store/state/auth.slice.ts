import { SignInData, SignUpData, VerificationData } from '@/types/auth'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { setUser, clearUser } from '@/store/state/user.slice'
import { api } from '@/services/api/index'

interface AuthState {
  access_token: string | null
  isLoading: boolean
  isFormLoading: boolean
  isVerifying: boolean
  needsVerification: boolean | null
  isAuthenticated: boolean
  message: string | null
  error: string | null
}

const initialState: AuthState = {
  access_token: null,
  isLoading: false,
  isFormLoading: false,
  isVerifying: false,
  needsVerification: null,
  isAuthenticated: false,
  message: null, // if you want to get the backend messages
  error: null // for unexpected errors
}

export const signUp = createAsyncThunk(
  'signUp',
  async (data: SignUpData, { rejectWithValue }) => {
    try {
      console.log(data)
      const response = await api.auth.signUp(data)
      return response.data.message
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to sign up')
    }
  }
)

export const verifyEmail = createAsyncThunk(
  'verifyEmail',
  async (data: VerificationData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.auth.verifyEmail(data)
      dispatch(setUser(response.data.user))
      dispatch(setSession(response.data.access_token))
      return response.data.message
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to verify email')
    }
  }
)

export const signIn = createAsyncThunk(
  'signIn',
  async (data: SignInData, { dispatch, rejectWithValue }) => {
    try {
      console.log(data)
      const response = await api.auth.signIn(data)
      console.log('RESPONSE',response)
      console.log('SET USER',response.data.user)
      dispatch(setUser(response.data.user))
      console.log("SET ACCESS TOKEN", response.data.access_token)
      dispatch(setSession(response.data.access_token))
      return response.data.message
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to sign in')
    }
  }
)

export const signOut = createAsyncThunk(
  'signOut',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await api.auth.signOut()
      dispatch(clearUser())
      dispatch(clearSession())
    } catch (error) {

      return rejectWithValue(error instanceof Error ? error.message : 'Failed to sign out')
    }
  }
)

export const refreshSession = createAsyncThunk(
  'refreshSession',
  async (_, { dispatch, rejectWithValue }) => {
      try {
          const access_token = localStorage.getItem('access_token')
          if (!access_token) {
            dispatch(clearSession())
            return
          }
          const response = await api.auth.refreshSession()
          dispatch(setUser(response.data.user))
          dispatch(setSession(response.data.access_token))
          return response.data.message
      } catch (error) {
          return rejectWithValue(error instanceof Error ? error.message : 'An error occurred')
      }
  }
)

export const googleCallback = createAsyncThunk(
  'googleCallback',
  async (code: string, { dispatch, rejectWithValue }) => {
    try {
      console.log("THE CODE",code)
      const response = await api.auth.googleCallback(code)
      console.log("step 1", response)
      console.log("step 2", response.data.message)
      console.log("step 3", response.data.user)
      console.log("step 4", response.data.access_token)
      dispatch(setUser(response.data.user))
      dispatch(setSession(response.data.access_token))
      return response.data.message
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to sign in with Google')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.access_token = action.payload
      localStorage.setItem('access_token', action.payload)
      state.isAuthenticated = true
      state.needsVerification = false
    },
    clearSession: (state) => {
      state.access_token = null
      localStorage.removeItem('access_token')
      state.isAuthenticated = false
      state.needsVerification = null
    }
  },
  extraReducers: (builder) => {

    // Sign Up (doesn't create user, only pending user and verification)
    builder.addCase(signUp.pending, (state) => {
      state.isFormLoading = true
      state.error = null
    })
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.isFormLoading = false
      state.needsVerification = true
      state.message = action.payload
    })
    builder.addCase(signUp.rejected, (state, action) => {
      state.isFormLoading = false
      state.error = action.payload as string
    })

    // Verify Email (creates user and session on success)
    builder.addCase(verifyEmail.pending, (state) => {
      state.isVerifying = true
      state.error = null
    })
    builder.addCase(verifyEmail.fulfilled, (state, action) => {
      state.isVerifying = false
      state.message = action.payload
    })
    builder.addCase(verifyEmail.rejected, (state, action) => {
      state.isVerifying = false
      state.error = action.payload as string
    })

    // Sign In
    builder.addCase(signIn.pending, (state) => {
      state.isFormLoading = true
      state.isLoading = true
      state.error = null
    })
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.isFormLoading = false
      state.isLoading = false
      state.message = action.payload
    })
    builder.addCase(signIn.rejected, (state, action) => {
      state.isFormLoading = false
      state.isLoading = false
      state.error = action.payload as string
    })

    // Sign Out
    builder.addCase(signOut.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(signOut.fulfilled, (state) => {
      state.isLoading = false
    })
    builder.addCase(signOut.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Refresh Session
    builder.addCase(refreshSession.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(refreshSession.fulfilled, (state, action) => {
      state.isLoading = false
      state.message = action.payload
    })
    builder.addCase(refreshSession.rejected, (state) => {
      state.isLoading = false
    })

    // Google Callback
    builder.addCase(googleCallback.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(googleCallback.fulfilled, (state, action) => {
      state.isLoading = false
      state.message = action.payload
    })
    builder.addCase(googleCallback.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })
  },
})

export const { setSession, clearSession } = authSlice.actions
export default authSlice.reducer

// import { User } from '@/types/db'
// import { PayloadAction, createSlice } from '@reduxjs/toolkit'

// const initialState: User = {
//   id: '',
//   email: '',
//   first_name: '',
//   last_name: '',
//   user_name: 'lebron_james',
//   icon_url: '',
//   created_on: '',
// }

// export const authSlice = createSlice({
//   name: 'auth-state',
//   initialState,
//   reducers: {
//     addProfile: (state, action: PayloadAction<User>) => {
//       return {
//         ...state,
//         ...action.payload,
//       }
//     },
//     removeProfile: () => initialState,
//   },
// })

// export const { addProfile, removeProfile } = authSlice.actions

// export default authSlice.reducer
