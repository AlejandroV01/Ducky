'use client'
import React, { useState } from 'react'
import { api } from '@/services/api'
import { useAppSelector } from '@/store/hooks'
import { Album, PaginatedResponse, AlbumMember } from '@/types/db'

interface TestResponse {
  data: any
  error?: string
}

export default function TestAlbum() {
  const { access_token } = useAppSelector((state) => state.auth)
  const { user } = useAppSelector((state) => state.user)

  // States for storing API responses
  const [createResponse, setCreateResponse] = useState<TestResponse | null>(null)
  const [allAlbumsResponse, setAllAlbumsResponse] = useState<TestResponse | null>(null)
  const [paginatedResponse, setPaginatedResponse] = useState<TestResponse | null>(null)
  const [myAlbumsResponse, setMyAlbumsResponse] = useState<TestResponse | null>(null)
  const [singleAlbumResponse, setSingleAlbumResponse] = useState<TestResponse | null>(null)
  const [updateResponse, setUpdateResponse] = useState<TestResponse | null>(null)
  const [membersResponse, setMembersResponse] = useState<TestResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Sample data for creating album
  const sampleAlbum = {
    title: "Test Album",
    description: "This is a test album created for testing purposes",
    public: true
  }

  // Sample data for updating album
  const sampleUpdate = {
    title: "Updated Test Album",
    description: "This description has been updated",
    archived: false
  }

  const handleApiCall = async (
    apiCall: () => Promise<any>,
    setResponse: (data: TestResponse) => void
  ) => {
    try {
      setError(null)
      const result = await apiCall()
      setResponse({ data: result.data })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  if (!access_token) {
    return <div className="p-4">Please login first to test album API calls</div>
  }

  return (
    <div className='flex flex-col w-full items-center gap-8 p-8'>
      <div className="flex flex-col gap-8 p-8">
        {/* Create Album */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Create Album</h2>
          <button
            onClick={() => handleApiCall(
              () => api.album.createAlbum(access_token, sampleAlbum),
              setCreateResponse
            )}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Test Album
          </button>
          {createResponse && (
            <pre className="mt-4 bg-gray-900 p-4 rounded overflow-auto">
              {JSON.stringify(createResponse, null, 2)}
            </pre>
          )}
        </div>

        {/* Get All Albums */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Get All Albums</h2>
          <button
            onClick={() => handleApiCall(
              () => api.album.getAllAlbums(access_token),
              setAllAlbumsResponse
            )}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Fetch All Albums
          </button>
          {allAlbumsResponse && (
            <pre className="mt-4 bg-gray-900 p-4 rounded overflow-auto">
              {JSON.stringify(allAlbumsResponse, null, 2)}
            </pre>
          )}
        </div>

        {/* Get Paginated Albums */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Get Paginated Albums</h2>
          <button
            onClick={() => handleApiCall(
              () => api.album.getPaginatedAlbums(access_token, 1, 5),
              setPaginatedResponse
            )}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Fetch Page 1 (5 items)
          </button>
          {paginatedResponse && (
            <pre className="mt-4 bg-gray-900 p-4 rounded overflow-auto">
              {JSON.stringify(paginatedResponse, null, 2)}
            </pre>
          )}
        </div>

        {/* Get My Albums */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Get My Albums</h2>
          <button
            onClick={() => handleApiCall(
              () => api.album.getMyAlbums(access_token),
              setMyAlbumsResponse
            )}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Fetch My Albums
          </button>
          {myAlbumsResponse && (
            <pre className="mt-4 bg-gray-900 p-4 rounded overflow-auto">
              {JSON.stringify(myAlbumsResponse, null, 2)}
            </pre>
          )}
        </div>

        {/* Get Single Album (requires album ID) */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Get Album by ID</h2>
          <button
            onClick={() => {
              if (createResponse?.data?.id) {
                handleApiCall(
                  () => api.album.getAlbumById(access_token, createResponse.data.id),
                  setSingleAlbumResponse
                )
              } else {
                setError('Please create an album first')
              }
            }}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
          >
            Fetch Created Album
          </button>
          {singleAlbumResponse && (
            <pre className="mt-4 bg-gray-900 p-4 rounded overflow-auto">
              {JSON.stringify(singleAlbumResponse, null, 2)}
            </pre>
          )}
        </div>

        {/* Update Album */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Update Album</h2>
          <button
            onClick={() => {
              if (createResponse?.data?.id) {
                handleApiCall(
                  () => api.album.updateAlbum(
                    access_token,
                    createResponse.data.id,
                    sampleUpdate
                  ),
                  setUpdateResponse
                )
              } else {
                setError('Please create an album first')
              }
            }}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Update Created Album
          </button>
          {updateResponse && (
            <pre className="mt-4 bg-gray-900 p-4 rounded overflow-auto">
              {JSON.stringify(updateResponse, null, 2)}
            </pre>
          )}
        </div>

        {/* Get Album Members */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Get Album Members</h2>
          <button
            onClick={() => {
              if (createResponse?.data?.id) {
                handleApiCall(
                  () => api.album.getAlbumMembers(access_token, createResponse.data.id),
                  setMembersResponse
                )
              } else {
                setError('Please create an album first')
              }
            }}
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
          >
            Fetch Album Members
          </button>
          {membersResponse && (
            <pre className="mt-4 bg-gray-900 p-4 rounded overflow-auto">
              {JSON.stringify(membersResponse, null, 2)}
            </pre>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {error}
          </div>
        )}
      </div>
    </div>
  )
}