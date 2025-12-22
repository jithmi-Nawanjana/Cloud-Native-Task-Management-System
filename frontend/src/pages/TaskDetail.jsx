import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchTask } from '../api/tasks'
import { isAdmin } from '../api/client'

function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTask = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchTask(id)
        setTask(data)
      } catch (err) {
        setError(err.message || 'Unable to load task')
      } finally {
        setLoading(false)
      }
    }

    loadTask()
  }, [id])

  return (
    <div className="page">
      <div className="breadcrumbs">
        <button className="ghost small" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
      <h2>Task Details</h2>

      <div className="card">
        {loading && <p>Loading…</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && task && (
          <div className="detail-grid">
            <div>
              <div className="label">Title</div>
              <div className="value">{task.title}</div>
            </div>
            <div>
              <div className="label">Status</div>
              <div className="value">
                <span className={`pill status-${task.status?.toLowerCase()}`}>
                  {task.status?.replace('_', ' ')}
                </span>
              </div>
            </div>
            <div>
              <div className="label">Priority</div>
              <div className="value">
                <span className={`pill priority-${task.priority?.toLowerCase()}`}>
                  {task.priority}
                </span>
              </div>
            </div>
            <div>
              <div className="label">Assignee</div>
              <div className="value">
                {task.assigneeName
                  ? `${task.assigneeName} (${task.assigneeId})`
                  : 'Unassigned'}
              </div>
            </div>
            <div className="full-row">
              <div className="label">Description</div>
              <div className="value description">
                {task.description || 'No description provided.'}
              </div>
            </div>
          </div>
        )}

        {!loading && !error && task && (
          <div className="detail-actions">
            {isAdmin() && (
              <Link className="primary link-button" to={`/tasks/${id}`}>
                Edit Task
              </Link>
            )}
            <Link className="ghost link-button" to="/tasks">
              Back to list
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskDetail

