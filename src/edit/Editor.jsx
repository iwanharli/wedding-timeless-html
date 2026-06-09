import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { authFetch, clearToken } from './authClient'
import { apiUrl } from '../lib/api'
import { CONTENT_SECTIONS } from './contentSchemas'
import { setPath } from './utils'
import SectionForm from './SectionForm'
import LayoutPanel from './LayoutPanel'
import PreviewPanel from './PreviewPanel'
import GuestList from './GuestList'
import Dashboard from './Dashboard'
import WishesList from './WishesList'
import ShareSetup from './ShareSetup'
import TrafficDetail from './TrafficDetail'
import MediaLibrary from './MediaLibrary'
import './edit.css'

const NAV_ICON = {
  general:     'fa-globe',
  hero:        'fa-image',
  backdrop:    'fa-film',
  profile:     'fa-address-card',
  loveStory:   'fa-heart',
  event:       'fa-calendar-alt',
  dressCode:   'fa-tshirt',
  rsvp:        'fa-envelope',
  gift:        'fa-gift',
  gallery:     'fa-images',
  thankYou:    'fa-star',
}

// Editor section ID → public site section ID to scroll to
const EDITOR_TO_SECTION = {
  hero:      'hero',
  backdrop:  'backdrop',
  profile:   'profileIntro',
  loveStory: 'loveStory',
  event:     'event',
  dressCode: 'dressCode',
  rsvp:      'rsvp',
  gift:      'gift',
  gallery:   'gallery',
  thankYou:  'thankYou',
}

const CONTENT_IDS = new Set(['general', 'hero', 'backdrop', 'profile', 'loveStory', 'event', 'dressCode', 'rsvp', 'gift', 'gallery', 'thankYou'])
const SPECIAL_VIEWS = new Set(['dashboard', 'guests', 'wishes', 'share', 'media', 'layout', 'traffic-detail'])

// Public site section ID → editor section ID
const SECTION_TO_EDITOR = {
  hero:         'hero',
  intro:        'hero',
  profileIntro: 'profile',
  groom:        'general',
  bride:        'general',
  loveStory:    'loveStory',
  countdown:    'event',
  event:        'event',
  livestream:   'event',
  dressCode:    'dressCode',
  rsvp:         'rsvp',
  wishes:       'rsvp',
  gift:         'gift',
  gallery:      'gallery',
  thankYou:     'thankYou',
}

export default function Editor() {
  const { section, sectionId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!section && !sectionId) {
      navigate('/admin/dashboard', { replace: true })
    } else if (section) {
      if (CONTENT_IDS.has(section)) {
        // Old-style /admin/hero → redirect to /admin/section/hero
        navigate(`/admin/section/${section}`, { replace: true })
      } else if (!SPECIAL_VIEWS.has(section)) {
        navigate('/404', { replace: true })
      }
    } else if (sectionId && !CONTENT_IDS.has(sectionId)) {
      navigate('/404', { replace: true })
    }
  }, [section, sectionId, navigate])

  const activeId = sectionId || section || 'layout'
  const hasToolbar = !['dashboard', 'guests', 'wishes', 'traffic-detail', 'media'].includes(activeId)

  const [draft, setDraft] = useState(null)
  const [savedJson, setSavedJson] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [status, setStatus] = useState(null)
  const [saving, setSaving] = useState(false)
  const statusTimer = useRef(null)

  const load = useCallback(async () => {
    setLoadError(null)
    try {
      const res = await fetch(apiUrl('/api/config'))
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      
      // Auto-initialize share object if it doesn't exist in the database yet
      data.share = {
        whatsappTemplate: data.share?.whatsappTemplate || "Halo {{name}},\n\nKami mengundangmu untuk hadir di pernikahan kami. Silakan buka undangan lewat link berikut:\n{{link}}\n\nTolong konfirmasi ya, kami menantikan kehadiranmu.",
        ogTitle: data.share?.ogTitle || "Undangan Pernikahan",
        ogDescription: data.share?.ogDescription || "Kami mengundangmu untuk merayakan hari istimewa kami. Klik tautan undangan untuk melihat detail acara dan RSVP.",
        ogImage: data.share?.ogImage || "/assets/images/Timeless-00036.jpg"
      }
      
      setDraft(data)
      setSavedJson(JSON.stringify(data))
    } catch (err) {
      setLoadError(err.message)
    }
  }, [])

  useEffect(() => { load() }, [load])

  function updateField(path, value) {
    setDraft(prev => setPath(prev, path, value))
  }
  function updateArray(path, items) {
    setDraft(prev => setPath(prev, path, items))
  }
  function updateSections(sections) {
    setDraft(prev => ({ ...prev, sections }))
  }

  async function handleSave() {
    setSaving(true)
    setStatus(null)
    clearTimeout(statusTimer.current)
    try {
      const res = await authFetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || `Save failed (${res.status})`)
      setSavedJson(JSON.stringify(draft))
      setStatus({ type: 'success', message: '✓ Saved successfully' })
      setRefreshKey(k => k + 1)
    } catch (err) {
      setStatus({ type: 'error', message: `✕ ${err.message}` })
    } finally {
      setSaving(false)
      statusTimer.current = setTimeout(() => setStatus(null), 4000)
    }
  }

  function handleRevert() {
    if (savedJson) setDraft(JSON.parse(savedJson))
  }

  function handleLogout() {
    clearToken()
    navigate('/login', { replace: true })
  }

  const hasChanges = draft !== null && savedJson !== null && JSON.stringify(draft) !== savedJson

  // Ctrl+S / Cmd+S — always references latest values via ref
  const saveStateRef = useRef({})
  saveStateRef.current = { hasChanges, saving, handleSave }
  useEffect(() => {
    function onKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        const { hasChanges, saving, handleSave } = saveStateRef.current
        if (hasChanges && !saving) handleSave()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Warn before closing tab with unsaved changes
  useEffect(() => {
    function onBeforeUnload(e) {
      if (!hasChanges) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [hasChanges])

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const iframeRef = useRef(null)
  // track whether we just sent a scroll command, to avoid echo-back loop
  const scrollingRef = useRef(false)

  // Editor → preview: scroll when section changes
  useEffect(() => {
    const sectionId = EDITOR_TO_SECTION[activeId]
    if (!sectionId || !iframeRef.current) return
    scrollingRef.current = true
    iframeRef.current.contentWindow?.postMessage(
      { type: 'scrollToSection', id: sectionId },
      window.location.origin
    )
    setTimeout(() => { scrollingRef.current = false }, 1200)
  }, [activeId])

  // Preview → editor: sync active section when user scrolls
  // Guard: skip for special views that don't map to content sections
  useEffect(() => {
    function handleMessage(e) {
      if (e.data?.type !== 'sectionVisible') return
      if (scrollingRef.current) return
      if (SPECIAL_VIEWS.has(activeId)) return
      const editorId = SECTION_TO_EDITOR[e.data.id]
      if (editorId) {
        const path = CONTENT_IDS.has(editorId) ? `/admin/section/${editorId}` : `/admin/${editorId}`
        navigate(path, { replace: true })
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [navigate, activeId])

  const isSectionActive = useCallback((menuId) => {
    if (!draft || !draft.sections) return true
    const map = {
      profile: ['profileIntro'],
      loveStory: ['loveStory'],
      event: ['event', 'countdown', 'livestream'],
      dressCode: ['dressCode'],
      rsvp: ['rsvp'],
      gift: ['gift'],
      gallery: ['gallery'],
      thankYou: ['thankYou'],
      wishes: ['wishes']
    }
    const targetIds = map[menuId]
    if (!targetIds) return true
    return draft.sections.some(s => targetIds.includes(s.id) && s.visible)
  }, [draft])

  // Auto-redirect if trying to access an inactive section
  useEffect(() => {
    if (draft && !isSectionActive(activeId)) {
      navigate('/admin/layout', { replace: true })
    }
  }, [activeId, draft, navigate, isSectionActive])

  const activeSection = CONTENT_SECTIONS.find(s => s.id === activeId)
  const activeLabel =
    activeId === 'dashboard' ? 'Dashboard' :
    activeId === 'media' ? 'Media Library' :
    activeId === 'traffic-detail' ? 'Detail Kunjungan (Traffic)' :
    activeId === 'layout'    ? 'Section Layout' :
    activeId === 'guests'    ? 'Daftar Tamu' :
    activeId === 'wishes'    ? 'Daftar Ucapan' :
    activeId === 'share'     ? 'Share Setup' :
    (activeSection?.label || '')

  function navTo(id) {
    if (CONTENT_IDS.has(id)) navigate(`/admin/section/${id}`)
    else navigate(`/admin/${id}`)
    setSidebarOpen(false)
  }

  if (loadError) {
    return (
      <div className="edit-shell edit-shell--center">
        <div className="edit-error-card">
          <p>Failed to load config: {loadError}</p>
          <button type="button" onClick={load}>
            <i className="fas fa-redo-alt" /> Retry
          </button>
        </div>
      </div>
    )
  }

  if (!draft) {
    return (
      <div className="edit-shell edit-shell--center">
        <div className="edit-loading-spinner" />
      </div>
    )
  }

  return (
    <div className={`edit-shell${previewVisible ? ' preview-open' : ''}`}>
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className="edit-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`edit-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="edit-sidebar-header">
          <div className="edit-sidebar-brand">
            <div className="edit-sidebar-brand-icon">
              <i className="fas fa-ring" />
            </div>
            <div>
              <div className="edit-sidebar-brand-name">Wedding Editor</div>
              <div className="edit-sidebar-brand-sub">Content Management</div>
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
            Daftar Tamu
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
            className={`edit-nav-item${activeId === 'media' ? ' active' : ''}`}
            onClick={() => navTo('media')}
          >
            <span className="edit-nav-item-icon"><i className="fas fa-photo-video" /></span>
            Media Library
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
          <button
            type="button"
            className={`edit-nav-item${activeId === 'layout' ? ' active' : ''}`}
            onClick={() => navTo('layout')}
          >
            <span className="edit-nav-item-icon"><i className="fas fa-th-large" /></span>
            Section Layout
          </button>

          <div className="edit-nav-divider" />
          <div className="edit-nav-section">
            <span className="edit-nav-section-label">Section</span>
          </div>
          {CONTENT_SECTIONS.map(s => {
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
          <a href="/" target="_blank" rel="noreferrer">
            <i className="fas fa-external-link-alt" /> View public site
          </a>
          <button type="button" className="edit-sidebar-footer-logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt" /> Log out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="edit-main">
        {hasToolbar && (
          <header className="edit-toolbar">
            <div className="edit-toolbar-left">
              <button
                type="button"
                className="edit-hamburger"
                onClick={() => setSidebarOpen(v => !v)}
                title="Toggle menu"
              >
                <i className="fas fa-bars" />
              </button>
              <span className="edit-toolbar-title">{activeLabel}</span>
              {hasChanges && (
                <span className="edit-unsaved-badge">Unsaved changes</span>
              )}
            </div>
            <div className="edit-toolbar-right">
              {activeId !== 'guests' && activeId !== 'dashboard' && activeId !== 'wishes' && activeId !== 'traffic-detail' && (
                <div className="edit-toolbar-save-wrap">
                  {status && (
                    <span className={`edit-status-toast edit-status-toast--${status.type}`}>
                      {status.message}
                    </span>
                  )}
                  {hasChanges && (
                    <button
                      type="button"
                      className="edit-revert-btn"
                      onClick={handleRevert}
                      disabled={saving}
                      title="Batalkan semua perubahan yang belum disimpan"
                    >
                      <i className="fas fa-undo" />
                      <span className="edit-save-btn-label">Revert</span>
                    </button>
                  )}
                  <button
                    type="button"
                    className="edit-save-btn"
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                  >
                    {saving
                      ? <><i className="fas fa-circle-notch fa-spin" /> <span className="edit-save-btn-label">Saving…</span></>
                      : <><i className="fas fa-save" /> <span className="edit-save-btn-label">Save changes</span></>}
                  </button>
                </div>
              )}

              {activeId !== 'guests' && activeId !== 'dashboard' && activeId !== 'wishes' && activeId !== 'traffic-detail' && activeId !== 'share' && (
                <button
                  type="button"
                  className={`edit-preview-toggle-btn${previewVisible ? ' active' : ''}`}
                  onClick={() => setPreviewVisible(v => !v)}
                  title={previewVisible ? 'Hide preview' : 'Show mobile preview'}
                >
                  <i className="fas fa-mobile-alt" />
                </button>
              )}
            </div>
          </header>
        )}

        <div className={`edit-scroll${(activeId === 'guests' || activeId === 'dashboard' || activeId === 'wishes' || activeId === 'traffic-detail' || activeId === 'media') ? ' edit-scroll--full' : ''}${!hasToolbar ? ' edit-scroll--no-toolbar' : ''}`}>
          {activeId === 'media' ? (
            <MediaLibrary onMenuOpen={() => setSidebarOpen(true)} />
          ) : activeId === 'dashboard' ? (
            <Dashboard />
          ) : activeId === 'traffic-detail' ? (
            <TrafficDetail />
          ) : activeId === 'layout' ? (
            <LayoutPanel sections={draft.sections || []} onChange={updateSections} />
          ) : activeId === 'guests' ? (
            <GuestList config={draft} onMenuOpen={() => setSidebarOpen(true)} />
          ) : activeId === 'wishes' ? (
            <WishesList onMenuOpen={() => setSidebarOpen(true)} />
          ) : activeId === 'share' ? (
            <ShareSetup draft={draft} onFieldChange={updateField} />
          ) : activeSection ? (
            <SectionForm
              key={activeSection.id}
              schema={activeSection}
              draft={draft}
              onFieldChange={updateField}
              onArrayChange={updateArray}
            />
          ) : null}
        </div>
      </main>

      <PreviewPanel
        ref={iframeRef}
        visible={previewVisible && activeId !== 'guests' && activeId !== 'dashboard' && activeId !== 'wishes' && activeId !== 'traffic-detail' && activeId !== 'share' && activeId !== 'media'}
        onRefresh={() => setRefreshKey(k => k + 1)}
        activeLabel={activeLabel}
        refreshKey={refreshKey}
      />
    </div>
  )
}
