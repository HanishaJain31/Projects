import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation()
  const { token, role } = useSelector((state) => state.auth)

  const currentToken = token || localStorage.getItem('token')
  const currentRole = role || localStorage.getItem('role')

  if (!currentToken) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles?.length && !allowedRoles.includes(currentRole)) {
    return <Navigate to={currentRole === 'admin' ? '/admin/home' : '/'} replace />
  }

  return children
}
