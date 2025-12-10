import apiClient, { errorMessage } from './client'

export const fetchTasks = async (filters = {}) => {
  try {
    const params = {}
    if (filters.status) params.status = filters.status
    if (filters.priority) params.priority = filters.priority
    if (filters.assigneeId) params.assigneeId = filters.assigneeId

    const response = await apiClient.get('/tasks/search', { params })
    return response.data ?? []
  } catch (err) {
    throw new Error(errorMessage(err, 'Failed to load tasks'))
  }
}

export const fetchTask = async (id) => {
  try {
    const response = await apiClient.get(`/tasks/${id}`)
    return response.data
  } catch (err) {
    throw new Error(errorMessage(err, 'Failed to load task'))
  }
}

export const createTask = async (payload) => {
  try {
    const response = await apiClient.post('/tasks', payload)
    return response.data
  } catch (err) {
    throw new Error(errorMessage(err, 'Failed to create task'))
  }
}

export const updateTask = async (id, payload) => {
  try {
    const response = await apiClient.put(`/tasks/${id}`, payload)
    return response.data
  } catch (err) {
    throw new Error(errorMessage(err, 'Failed to update task'))
  }
}

