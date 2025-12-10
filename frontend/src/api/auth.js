import apiClient, { setAuthToken, clearAuthToken, errorMessage } from './client'

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password })
    const token = response.data?.token
    setAuthToken(token)
    return token
  } catch (err) {
    clearAuthToken()
    throw new Error(errorMessage(err, 'Login failed'))
  }
}

export const register = async (name, email, password) => {
  try {
    const response = await apiClient.post('/auth/register', { name, email, password })
    const token = response.data?.token
    setAuthToken(token)
    return token
  } catch (err) {
    clearAuthToken()
    throw new Error(errorMessage(err, 'Registration failed'))
  }
}

export const logout = () => {
  clearAuthToken()
}

