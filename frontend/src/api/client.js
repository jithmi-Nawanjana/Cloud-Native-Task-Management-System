import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export const getAuthToken = () => localStorage.getItem('token')
export const hasAuthToken = () => Boolean(getAuthToken())
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token)
  } else {
    localStorage.removeItem('token')
  }
}
export const clearAuthToken = () => localStorage.removeItem('token')

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const errorMessage = (error, fallback = 'Request failed') => {
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.message) return error.message
  return fallback
}

export default apiClient

