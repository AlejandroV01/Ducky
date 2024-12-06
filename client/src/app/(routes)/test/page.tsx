'use client'
import React, { useState } from 'react'
import { api } from '@/services/api'
import { useAppSelector } from '@/store/hooks'
import { User } from '@/types/db'

interface ApiResponse {
  data: any
  status: number
}

export default function Test() {
  const { user } = useAppSelector((state) => state.user)
  const { access_token } = useAppSelector((state) => state.auth)

  // State for each API call result
  const [meData, setMeData] = useState<ApiResponse | null>(null)
  const [allUsersData, setAllUsersData] = useState<ApiResponse | null>(null)
  const [paginatedData, setPaginatedData] = useState<ApiResponse | null>(null)
  const [userByIdData, setUserByIdData] = useState<ApiResponse | null>(null)
  const [updateData, setUpdateData] = useState<ApiResponse | null>(null)
  const [deleteData, setDeleteData] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Handler for API calls
  const handleApiCall = async (
    apiCall: () => Promise<any>,
    setData: (data: ApiResponse) => void
  ) => {
    try {
      setError(null)
      const result = await apiCall()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  // Test data for update
  const updateTestData: Partial<User> = {
    first_name: "Test",
    last_name: "Update",
    user_name: "testupdate"
  }

  if (!access_token) {
    return <div>Please login first to test API calls</div>
  }

  return (
    <div className='flex flex-col w-full items-center gap-8 p-8'>
      {/* Get Me */}
      <div className='flex flex-col items-center gap-4'>
        <button
          onClick={() => handleApiCall(
            () => api.user.getMe(access_token),
            setMeData
          )}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          Test Get Me
        </button>
        {meData && (
          <pre className='bg-gray-800 p-4 rounded max-w-xl overflow-auto'>
            {JSON.stringify(meData, null, 2)}
          </pre>
        )}
      </div>

      {/* Get All Users */}
      <div className='flex flex-col items-center gap-4'>
        <button
          onClick={() => handleApiCall(
            () => api.user.getAllUsers(access_token),
            setAllUsersData
          )}
          className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
        >
          Test Get All Users
        </button>
        {allUsersData && (
          <pre className='bg-gray-800 p-4 rounded max-w-xl overflow-auto'>
            {JSON.stringify(allUsersData, null, 2)}
          </pre>
        )}
      </div>

      {/* Get Paginated Users */}
      <div className='flex flex-col items-center gap-4'>
        <button
          onClick={() => handleApiCall(
            () => api.user.getPaginatedUsers(access_token, 1, 10),
            setPaginatedData
          )}
          className='px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600'
        >
          Test Get Paginated Users (Page 1, Limit 10)
        </button>
        {paginatedData && (
          <pre className='bg-gray-800 p-4 rounded max-w-xl overflow-auto'>
            {JSON.stringify(paginatedData, null, 2)}
          </pre>
        )}
      </div>

      {/* Get User by ID */}
      <div className='flex flex-col items-center gap-4'>
        <button
          onClick={() => handleApiCall(
            () => api.user.getUserById(access_token, user.id),
            setUserByIdData
          )}
          className='px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600'
        >
          Test Get User by ID (Current User)
        </button>
        {userByIdData && (
          <pre className='bg-gray-800 p-4 rounded max-w-xl overflow-auto'>
            {JSON.stringify(userByIdData, null, 2)}
          </pre>
        )}
      </div>

      {/* Update User */}
      <div className='flex flex-col items-center gap-4'>
        <button
          onClick={() => handleApiCall(
            () => api.user.updateUser(access_token, user.id, updateTestData),
            setUpdateData
          )}
          className='px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600'
        >
          Test Update User
        </button>
        {updateData && (
          <pre className='bg-gray-800 p-4 rounded max-w-xl overflow-auto'>
            {JSON.stringify(updateData, null, 2)}
          </pre>
        )}
      </div>

      {/* Delete User */}
      <div className='flex flex-col items-center gap-4'>
        <button
          onClick={() => handleApiCall(
            () => api.user.deleteUser(access_token, user.id),
            setDeleteData
          )}
          className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
        >
          Test Delete User
        </button>
        {deleteData && (
          <pre className='bg-gray-800 p-4 rounded max-w-xl overflow-auto'>
            {JSON.stringify(deleteData, null, 2)}
          </pre>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className='text-red-500 mt-4 p-4 bg-red-100 rounded'>
          Error: {error}
        </div>
      )}
    </div>
  )
}