const API_BASE_URL = 'http://127.0.0.1:8000'

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await response.json()

  // if there is an error from the backend, display it, throw it to our redux thunk
  if (data.error) {
    throw new Error(data.error || 'An error occurred')
  }

  return data
}
