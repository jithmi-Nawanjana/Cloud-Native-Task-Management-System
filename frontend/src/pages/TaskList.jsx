import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchTasks as fetchTasksApi } from '../api/tasks'
import { isAdmin } from '../api/client'

const STATUSES = ['BACKLOG', 'IN_PROGRESS', 'DONE', 'ARCHIVED']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

function TaskList() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assigneeId: '',
  })

  const fetchTasks = async (overrideFilters = filters) => {
    setLoading(true)
    setError('')

    try {
      const data = await fetchTasksApi(overrideFilters)
      setTasks(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleReset = () => {
    const resetFilters = { status: '', priority: '', assigneeId: '' }
    setFilters(resetFilters)
    fetchTasks(resetFilters)
  }

  return (
    <div className="page">
      <h2>Tasks</h2>
      <div className="card">
        <form
          className="filters"
          onSubmit={(e) => {
            e.preventDefault()
            fetchTasks()
          }}
        >
          <label className="form-group inline">
            <span>Status</span>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">Any</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </label>

          <label className="form-group inline">
            <span>Priority</span>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="">Any</option>
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </label>

          <label className="form-group inline">
            <span>Assignee ID</span>
            <input
              type="number"
              min="1"
              value={filters.assigneeId}
              onChange={(e) => handleFilterChange('assigneeId', e.target.value)}
              placeholder="e.g. 3"
            />
          </label>

          <div className="filter-actions">
            <button type="submit" className="primary" disabled={loading}>
              {loading ? 'Loading…' : 'Apply'}
            </button>
            <button
              type="button"
              className="ghost"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="card">
        {loading ? (
          <p>Loading tasks…</p>
        ) : tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
              <th>Assignee</th>
              {isAdmin() && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <div className="task-title">{task.title}</div>
                      {task.description && (
                        <div className="muted">{task.description}</div>
                      )}
                    </td>
                    <td>
                      <span className={`pill status-${task.status?.toLowerCase()}`}>
                        {task.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`pill priority-${task.priority?.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      {task.assigneeName
                        ? `${task.assigneeName} (${task.assigneeId})`
                        : 'Unassigned'}
                    </td>
                  {isAdmin() && (
                    <td className="actions">
                      <Link className="text-link" to={`/tasks/${task.id}/view`}>
                        View
                      </Link>
                      <Link className="text-link" to={`/tasks/${task.id}`}>
                        Edit
                      </Link>
                    </td>
                  )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskList

