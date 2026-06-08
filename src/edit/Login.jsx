import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { getToken, setToken, isTokenValid } from './authClient'
import './edit.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  if (isTokenValid(getToken())) {
    return <Navigate to="/edit" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || 'Login failed')
      setToken(body.token)
      navigate(location.state?.from || '/edit', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="edit-login">
      {/* Left decorative panel */}
      <div className="edit-login-left">
        <div className="edit-login-brand">
          <span className="edit-login-brand-icon"><i className="fas fa-ring" /></span>
          <h1>Wedding Editor</h1>
          <p>Manage your wedding invitation content, sections, and layout from one place.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="edit-login-right">
        <form className="edit-login-form" onSubmit={handleSubmit}>
          <h2>Sign in</h2>
          <p>Enter your admin credentials to continue.</p>

          {error && (
            <div className="edit-status-toast edit-status-toast--error" style={{ marginBottom: 12 }}>
              ✕ &nbsp;{error}
            </div>
          )}

          <label className="edit-field">
            <span className="edit-field-label">Username</span>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="admin"
              required
            />
          </label>

          <label className="edit-field">
            <span className="edit-field-label">Password</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </label>

          <button type="submit" className="edit-save-btn" disabled={submitting}>
            {submitting
              ? <><i className="fas fa-circle-notch fa-spin" /> Signing in…</>
              : <><i className="fas fa-sign-in-alt" /> Sign in</>}
          </button>
        </form>
      </div>
    </div>
  )
}
