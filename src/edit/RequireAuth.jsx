import { Navigate, useLocation } from 'react-router-dom'
import { getToken, isTokenValid } from './authClient'

export default function RequireAuth({ children }) {
  const location = useLocation()
  if (!isTokenValid(getToken())) {
    return <Navigate to="/edit/login" replace state={{ from: location.pathname }} />
  }
  return children
}
