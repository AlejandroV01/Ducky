// store/state/album.slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '@/services/api'
import { Album } from '@/types/db'

interface AlbumState {
  currentAlbum: Album | null
  myAlbums: Album[]
  currentAlbumRole: string | null
  isLoading: boolean
  error: string | null
  totalPhotos: number
  members: any[] // Type this properly based on your member interface
  joinRequests: any[] // Type this properly based on your request interface
}

const initialState: AlbumState = {
  currentAlbum: null,
  myAlbums: [],
  currentAlbumRole: null,
  isLoading: false,
  error: null,
  totalPhotos: 0,
  members: [],
  joinRequests: []
}

// Thunks
export const createAlbum = createAsyncThunk(
  'album/create',
  async (data: { title: string; description: string; public: boolean }, { getState, rejectWithValue }) => {
    try {
      const { auth: { access_token } } = getState() as any
      const response = await api.album.createAlbum(access_token, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create album')
    }
  }
)

export const fetchMyAlbums = createAsyncThunk(
  'album/fetchMine',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth: { access_token } } = getState() as any
      const response = await api.album.getMyAlbums(access_token)
      return response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch albums')
    }
  }
)

export const fetchAlbumById = createAsyncThunk(
  'album/fetchById',
  async (albumId: string, { getState, rejectWithValue }) => {
    try {
      const { auth: { access_token } } = getState() as any
      const response = await api.album.getAlbumById(access_token, albumId)
      return response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch album')
    }
  }
)

export const fetchAlbumMembers = createAsyncThunk(
  'album/fetchMembers',
  async ({ albumId, page = 1, pageSize = 20 }: { albumId: string; page?: number; pageSize?: number }, 
  { getState, rejectWithValue }) => {
    try {
      const { auth: { access_token } } = getState() as any
      const response = await api.album.getAlbumMembers(access_token, albumId, page, pageSize)
      return response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch members')
    }
  }
)

const albumSlice = createSlice({
  name: 'album',
  initialState,
  reducers: {
    setCurrentAlbum(state, action) {
      state.currentAlbum = action.payload
    },
    setCurrentAlbumRole(state, action) {
      state.currentAlbumRole = action.payload
    },
    clearCurrentAlbum(state) {
      state.currentAlbum = null
      state.currentAlbumRole = null
      state.members = []
    }
  },
  extraReducers: (builder) => {
    // Create Album
    builder.addCase(createAlbum.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(createAlbum.fulfilled, (state, action) => {
      state.isLoading = false
      state.myAlbums.push(action.payload)
    })
    builder.addCase(createAlbum.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Fetch My Albums
    builder.addCase(fetchMyAlbums.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchMyAlbums.fulfilled, (state, action) => {
      state.isLoading = false
      state.myAlbums = action.payload
    })
    builder.addCase(fetchMyAlbums.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Fetch Album by ID
    builder.addCase(fetchAlbumById.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchAlbumById.fulfilled, (state, action) => {
      state.isLoading = false
      state.currentAlbum = action.payload
      state.currentAlbumRole = action.payload.role
    })
    builder.addCase(fetchAlbumById.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Fetch Album Members
    builder.addCase(fetchAlbumMembers.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchAlbumMembers.fulfilled, (state, action) => {
      state.isLoading = false
      state.members = action.payload
    })
    builder.addCase(fetchAlbumMembers.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })
  }
})

export const { setCurrentAlbum, setCurrentAlbumRole, clearCurrentAlbum } = albumSlice.actions
export default albumSlice.reducer