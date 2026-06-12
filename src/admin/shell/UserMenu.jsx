import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken, getUsername } from '../auth/authClient'
import './UserMenu.css'

export default function UserMenu() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const username = getUsername()

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function handleLogout() {
    clearToken()
    navigate('/login', { replace: true })
  }

  return (
    <div className="user-menu-group">
      <a href="/" target="_blank" rel="noreferrer" className="gl-btn gl-btn--ghost user-menu-view-link">
        <i className="fas fa-external-link-alt" /> <span className="user-menu-view-label">View public site</span>
      </a>
      <div className="user-menu" ref={ref}>
        <button type="button" className="user-menu-trigger" onClick={() => setOpen(o => !o)}>
          <span className="user-menu-avatar"><i className="fas fa-user" /></span>
          {username && <span className="user-menu-name">{username}</span>}
          <i className="fas fa-chevron-down user-menu-caret" />
        </button>
        {open && (
          <div className="user-menu-dropdown">
            <button type="button" className="user-menu-item user-menu-item--danger" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt" /> Log out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
