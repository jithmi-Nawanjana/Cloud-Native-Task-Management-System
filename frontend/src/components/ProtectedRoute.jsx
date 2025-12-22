import { Navigate, useLocation } from 'react-router-dom'
import { hasAuthToken } from '../api/client'

function ProtectedRoute({ children }) {
  const location = useLocation()
  if (!hasAuthToken()) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

export default ProtectedRoute

