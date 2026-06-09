import { useNavigate, useLocation } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <div className="nf">
      <div className="nf-card">
        <div className="nf-icon"><i className="fas fa-ring" /></div>
        <div className="nf-code">404</div>
        <div className="nf-divider" />
        <h1 className="nf-title">Halaman tidak ditemukan</h1>
        <p className="nf-desc">
          Halaman yang kamu cari tidak ada, sudah dipindahkan, atau URL yang dimasukkan salah.
        </p>
        <div className="nf-actions">
          <button type="button" className="nf-btn nf-btn--primary" onClick={() => navigate('/')}>
            <i className="fas fa-home" /> Beranda
          </button>
          {isAdmin && (
            <button type="button" className="nf-btn nf-btn--secondary" onClick={() => navigate('/admin/dashboard')}>
              <i className="fas fa-chart-pie" /> Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
