import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '@/services/api/index'
import { User } from '@/types/db'

interface UserState {
    user: User
    isLoading: boolean
    error : string | null
}

const defaultUserSettings: User = {
    id: '',
    email: '',
    first_name: '',
    last_name: '',
    user_name: '',
    icon_url: '',
    is_verified: false,
    auth_provider: undefined,
    last_login: undefined,
    created_at: undefined,
    login_attempts: undefined,
    last_failed_login: undefined
}

const initialState: UserState = {
    user: defaultUserSettings,
    isLoading: false,
    error: null
}

// not using right now as refresh automatically
// sends user data with access token
export const refreshUser = createAsyncThunk(
    'refreshUser',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const access_token = localStorage.getItem('access_token')
            if (!access_token) {
                return rejectWithValue('No access token found')
            }
            const response = await api.user.getMe(access_token)
            dispatch(setUser(response.data))
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred')   
        }
    }
)

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload
        },
        clearUser(state) {
            state.user = defaultUserSettings
        }
    },
    extraReducers: (builder) => {
        // Refresh User
        builder.addCase(refreshUser.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        builder.addCase(refreshUser.fulfilled, (state) => {
            state.isLoading = false
            state.error = null
        })
        builder.addCase(refreshUser.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message as string
        })
    }
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer