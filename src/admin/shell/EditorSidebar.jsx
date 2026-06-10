import { CONTENT_SECTIONS } from '../fields/contentSchemas'
import { NAV_ICON } from './editorConstants'

export default function EditorSidebar({ activeId, sidebarOpen, navTo, isSectionActive, handleLogout }) {
  return (
    <aside className={`edit-sidebar${sidebarOpen ? ' open' : ''}`}>
      <div className="edit-sidebar-header">
        <div className="edit-sidebar-brand">
          <div className="edit-sidebar-brand-icon">
            <div className="edit-sidebar-brand-icon-inner">
              <span className="edit-sidebar-brand-mono">RA</span>
            </div>
          </div>
          <div>
            <div className="edit-sidebar-brand-name">RnA</div>
            <div className="edit-sidebar-brand-sub">Wedding Management</div>
          </div>
        </div>
      </div>

      <nav className="edit-nav">
        <div className="edit-nav-section">
          <span className="edit-nav-section-label">Overview</span>
        </div>
        <button
          type="button"
          className={`edit-nav-item${activeId === 'dashboard' ? ' active' : ''}`}
          onClick={() => navTo('dashboard')}
        >
          <span className="edit-nav-item-icon"><i className="fas fa-chart-pie" /></span>
          Dashboard
        </button>
        <button
          type="button"
          className={`edit-nav-item${activeId === 'guests' ? ' active' : ''}`}
          onClick={() => navTo('guests')}
        >
          <span className="edit-nav-item-icon"><i className="fas fa-users" /></span>
          Tamu Undangan
        </button>
        <button
          type="button"
          className={`edit-nav-item${activeId === 'wishes' ? ' active' : ''}${!isSectionActive('wishes') ? ' disabled' : ''}`}
          onClick={() => {
            if (isSectionActive('wishes')) navTo('wishes')
          }}
          title={!isSectionActive('wishes') ? 'Section dinonaktifkan di Section Layout' : ''}
        >
          <span className="edit-nav-item-icon"><i className="fas fa-comment-dots" /></span>
          Daftar Ucapan
        </button>
        <button
          type="button"
          className={`edit-nav-item${activeId === 'gifts' ? ' active' : ''}`}
          onClick={() => navTo('gifts')}
        >
          <span className="edit-nav-item-icon"><i className="fas fa-gift" /></span>
          Daftar Hadiah
        </button>
        <div className="edit-nav-divider" />
        <button
          type="button"
          className={`edit-nav-item${activeId === 'media' ? ' active' : ''}`}
          onClick={() => navTo('media')}
        >
          <span className="edit-nav-item-icon"><i className="fas fa-photo-video" /></span>
          Media Library
        </button>
        <div className="edit-nav-divider" />
        <button
          type="button"
          className={`edit-nav-item${activeId === 'layout' ? ' active' : ''}`}
          onClick={() => navTo('layout')}
        >
          <span className="edit-nav-item-icon"><i className="fas fa-th-large" /></span>
          Section Layout
        </button>
        <button
          type="button"
          className={`edit-nav-item${activeId === 'mainSetup' ? ' active' : ''}`}
          onClick={() => navTo('mainSetup')}
        >
          <span className="edit-nav-item-icon"><i className="fas fa-sliders-h" /></span>
          Main Setup
        </button>
        <button
          type="button"
          className={`edit-nav-item${activeId === 'share' ? ' active' : ''}`}
          onClick={() => navTo('share')}
        >
          <span className="edit-nav-item-icon"><i className="fas fa-share-alt" /></span>
          Share Setup
        </button>

        <div className="edit-nav-divider" />
        <div className="edit-nav-section">
          <span className="edit-nav-section-label">Section</span>
        </div>
        {CONTENT_SECTIONS.filter(s => s.id !== 'mainSetup').map(s => {
          const active = isSectionActive(s.id)
          return (
            <button
              key={s.id}
              type="button"
              className={`edit-nav-item${activeId === s.id ? ' active' : ''}${!active ? ' disabled' : ''}`}
              onClick={() => {
                if (active) navTo(s.id)
              }}
              title={!active ? 'Section dinonaktifkan di Section Layout' : ''}
            >
              <span className="edit-nav-item-icon"><i className={`fas ${NAV_ICON[s.id] || 'fa-circle'}`} /></span>
              {s.label}
            </button>
          )
        })}
      </nav>

      <div className="edit-sidebar-footer">
        <a href="/" target="_blank" rel="noreferrer" className="edit-sidebar-footer-view">
          <i className="fas fa-external-link-alt" /> View public site
        </a>
        <button type="button" className="edit-sidebar-footer-logout" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt" /> Log out
        </button>
      </div>
    </aside>
  )
}
