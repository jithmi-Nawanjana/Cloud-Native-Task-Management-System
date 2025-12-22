import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { createTask, fetchTask, updateTask } from '../api/tasks'
import { isAdmin } from '../api/client'

const STATUSES = ['BACKLOG', 'IN_PROGRESS', 'DONE', 'ARCHIVED']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

function TaskCreate() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'BACKLOG',
    priority: 'MEDIUM',
    assigneeId: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadTask = async () => {
    if (!isEdit) return
    setLoading(true)
    setError('')
    try {
      const data = await fetchTask(id)
      setForm({
        title: data.title ?? '',
        description: data.description ?? '',
        status: data.status ?? 'BACKLOG',
        priority: data.priority ?? 'MEDIUM',
        assigneeId: data.assigneeId ?? '',
      })
    } catch (err) {
      setError(err.message || 'Unable to load task')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTask()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const payload = {
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        assigneeId: form.assigneeId ? Number(form.assigneeId) : null,
      }

      if (isEdit) {
        await updateTask(id, payload)
      } else {
        await createTask(payload)
      }

      setSuccess(isEdit ? 'Task updated!' : 'Task created!')
      // Optionally navigate back after a short delay
      setTimeout(() => navigate('/tasks'), 600)
    } catch (err) {
      setError(err.message || 'Failed to save task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      {!isAdmin() && <Navigate to="/tasks" replace />}
      <h2>{isEdit ? 'Edit Task' : 'Create Task'}</h2>
      <div className="card">
        <form className="form" onSubmit={handleSubmit}>
          <label className="form-group">
            <span>Title</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </label>

          <label className="form-group">
            <span>Description</span>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              placeholder="What needs to be done?"
            />
          </label>

          <div className="form two-col">
            <label className="form-group">
              <span>Status</span>
              <select
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-group">
              <span>Priority</span>
              <select
                value={form.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="form-group">
            <span>Assignee ID</span>
            <input
              type="number"
              min="1"
              value={form.assigneeId}
              onChange={(e) => handleChange('assigneeId', e.target.value)}
              placeholder="User ID"
            />
          </label>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <div className="filter-actions">
            <button type="submit" className="primary" disabled={loading}>
              {loading ? 'Saving…' : isEdit ? 'Update Task' : 'Create Task'}
            </button>
            <button
              type="button"
              className="ghost"
              onClick={() => navigate('/tasks')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskCreate

