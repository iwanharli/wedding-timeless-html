import { useState, useEffect, useCallback, useRef, useMemo, lazy, Suspense } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { authFetch, clearToken, getRole } from '../auth/authClient'
import { apiUrl } from '../../lib/api'
import { CONTENT_SECTIONS } from '../fields/contentSchemas'
import { setPath } from '../utils'
import { DEFAULT_SECTIONS, DEFAULT_HERO_BACKGROUND } from '../../data/sectionDefaults'
import {
  CONTENT_IDS,
  SPECIAL_VIEWS,
  SECTION_TO_EDITOR,
  EDITOR_TO_SECTION,
  PREVIEW_HIDDEN_VIEWS,
  SCROLL_FULL_VIEWS,
  USER_ROLE_VIEWS,
  getSectionTopKeys,
} from './editorConstants'
import { usePreviewSync } from './usePreviewSync'
import EditorSidebar from './EditorSidebar'
import EditorToolbar from './EditorToolbar'
import NavGuardModal from './NavGuardModal'

const SectionForm      = lazy(() => import('../fields/SectionForm'))
const LayoutPanel      = lazy(() => import('../pages/LayoutPanel'))
const PreviewPanel     = lazy(() => import('./PreviewPanel'))
const GuestList        = lazy(() => import('../pages/GuestList'))
const Dashboard        = lazy(() => import('../pages/Dashboard'))
const WishesList       = lazy(() => import('../pages/WishesList'))
const ShareSetup       = lazy(() => import('../pages/ShareSetup'))
const TrafficDetail    = lazy(() => import('../pages/TrafficDetail'))
const MediaLibrary     = lazy(() => import('../pages/MediaLibrary'))
const GiftConfirmations = lazy(() => import('../pages/GiftConfirmations'))
const WhatsApp          = lazy(() => import('../pages/WhatsApp'))
import '../styles/admin.css'

export default function Editor() {
  const { section, sectionId } = useParams()
  const navigate = useNavigate()
  const role = getRole()
  const isUserRole = role === 'user'

  useEffect(() => {
    if (!section && !sectionId) {
      navigate(isUserRole ? '/admin/guests' : '/admin/dashboard', { replace: true })
    } else if (section) {
      if (CONTENT_IDS.has(section)) {
        // Old-style /admin/hero → redirect to /admin/section/hero
        if (isUserRole) navigate('/admin/guests', { replace: true })
        else navigate(`/admin/section/${section}`, { replace: true })
      } else if (!SPECIAL_VIEWS.has(section)) {
        navigate('/404', { replace: true })
      } else if (isUserRole && !USER_ROLE_VIEWS.has(section)) {
        navigate('/admin/guests', { replace: true })
      }
    } else if (sectionId) {
      if (isUserRole) {
        navigate('/admin/guests', { replace: true })
      } else if (!CONTENT_IDS.has(sectionId)) {
        // Public site section ID (e.g. profileIntro, groom) → map to editor ID
        const redirectTo = SECTION_TO_EDITOR[sectionId]
        if (redirectTo && CONTENT_IDS.has(redirectTo)) {
          navigate(`/admin/section/${redirectTo}`, { replace: true })
        } else {
          navigate('/404', { replace: true })
        }
      }
    }
  }, [section, sectionId, navigate, isUserRole])

  const activeId = sectionId || section || 'layout'
  const activeSection = CONTENT_SECTIONS.find(s => s.id === activeId)
  const activeLabel =
    activeId === 'dashboard'      ? 'Dashboard' :
    activeId === 'media'          ? 'Media Library' :
    activeId === 'traffic-detail' ? 'Detail Kunjungan (Traffic)' :
    activeId === 'layout'         ? 'Section Layout' :
    activeId === 'guests'         ? 'Tamu Undangan' :
    activeId === 'whatsapp'       ? 'Kirim WhatsApp' :
    activeId === 'wishes'         ? 'Daftar Ucapan' :
    activeId === 'gifts'          ? 'Daftar Hadiah' :
    activeId === 'share'          ? 'Share Setup' :
    (activeSection?.label || '')
  const hasToolbar = !['dashboard', 'guests', 'whatsapp', 'wishes', 'gifts', 'traffic-detail', 'media'].includes(activeId)

  const [draft, setDraft] = useState(null)
  const [savedJson, setSavedJson] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [status, setStatus] = useState(null)
  const [saving, setSaving] = useState(false)
  const [pendingNav, setPendingNav] = useState(null)
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
        ogImage: data.share?.ogImage || ""
      }

      // Auto-initialize background field for sections that don't have it yet
      const defaultBgMap = Object.fromEntries(DEFAULT_SECTIONS.map(s => [s.id, s.background]))
      data.sections = (data.sections || DEFAULT_SECTIONS).map(s => ({
        ...s,
        background: s.background || defaultBgMap[s.id] || { type: 'video', value: '' },
      }))

      // Auto-initialize Hero/Cover background field if it doesn't exist yet
      data.hero = {
        ...data.hero,
        background: data.hero?.background || DEFAULT_HERO_BACKGROUND,
        leftPanel: data.hero?.leftPanel || { type: 'image', image: data.hero?.backgroundOverlayImage || '', video: '' },
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
  function updateHeroBackground(bg) {
    setDraft(prev => ({ ...prev, hero: { ...prev.hero, background: { ...prev.hero.background, ...bg } } }))
  }

  async function handleSave() {
    setSaving(true)
    setStatus(null)
    clearTimeout(statusTimer.current)
    try {
      let payload
      if (activeSection) {
        const saved = JSON.parse(savedJson)
        const keys = getSectionTopKeys(activeSection)
        payload = { ...saved }
        for (const k of keys) payload[k] = draft[k]
      } else {
        payload = draft
      }
      const res = await authFetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || `Save failed (${res.status})`)
      setSavedJson(JSON.stringify(payload))
      setStatus({ type: 'success', message: '✓ Tersimpan' })
      setRefreshKey(k => k + 1)
      return true
    } catch (err) {
      setStatus({ type: 'error', message: `✕ ${err.message}` })
      return false
    } finally {
      setSaving(false)
      statusTimer.current = setTimeout(() => setStatus(null), 4000)
    }
  }

  function handleRevert() {
    if (!savedJson) return
    if (activeSection) {
      const saved = JSON.parse(savedJson)
      const keys = getSectionTopKeys(activeSection)
      setDraft(prev => {
        const next = { ...prev }
        for (const k of keys) next[k] = saved[k]
        return next
      })
    } else {
      setDraft(JSON.parse(savedJson))
    }
  }

  function handleLogout() {
    clearToken()
    navigate('/login', { replace: true })
  }

  const hasChanges = draft !== null && savedJson !== null && JSON.stringify(draft) !== savedJson

  const activeSectionHasChanges = useMemo(() => {
    if (!draft || !savedJson || !activeSection) return false
    const saved = JSON.parse(savedJson)
    return getSectionTopKeys(activeSection).some(
      k => JSON.stringify(draft[k]) !== JSON.stringify(saved[k])
    )
  }, [draft, savedJson, activeSection])

  const canSave = activeSection ? activeSectionHasChanges : hasChanges

  // Ctrl+S / Cmd+S — always references latest values via ref
  const saveStateRef = useRef({})
  saveStateRef.current = { hasChanges: canSave, saving, handleSave }
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
  const [layoutDrawerSection, setLayoutDrawerSection] = useState(null)

  const { iframeRef, handleTabChange } = usePreviewSync({ activeId, draft, navigate })

  const isSectionActive = useCallback((menuId) => {
    if (!draft || !draft.sections) return true
    const map = {
      intro: ['intro'],
      profile: ['profileIntro'],
      couple: ['groom', 'bride'],
      loveStory: ['loveStory'],
      countdown: ['countdown'],
      event: ['event'],
      livestream: ['livestream'],
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

  function doNavTo(id) {
    if (CONTENT_IDS.has(id)) navigate(`/admin/section/${id}`)
    else navigate(`/admin/${id}`)
    setSidebarOpen(false)
  }

  function navTo(id) {
    if (activeSectionHasChanges) {
      setPendingNav(id)
      setSidebarOpen(false)
      return
    }
    doNavTo(id)
  }

  async function handleModalSave() {
    const ok = await handleSave()
    if (ok) {
      doNavTo(pendingNav)
      setPendingNav(null)
    }
  }

  function handleModalDiscard() {
    if (savedJson && activeSection) {
      const saved = JSON.parse(savedJson)
      const keys = getSectionTopKeys(activeSection)
      setDraft(prev => {
        const next = { ...prev }
        for (const k of keys) next[k] = saved[k]
        return next
      })
    }
    doNavTo(pendingNav)
    setPendingNav(null)
  }

  function handleModalCancel() {
    setPendingNav(null)
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

      <EditorSidebar
        activeId={activeId}
        sidebarOpen={sidebarOpen}
        navTo={navTo}
        isSectionActive={isSectionActive}
        handleLogout={handleLogout}
      />

      {/* ── Main ── */}
      <main className="edit-main">
        {hasToolbar && (
          <EditorToolbar
            activeId={activeId}
            activeLabel={activeLabel}
            canSave={canSave}
            status={status}
            saving={saving}
            onSave={handleSave}
            onRevert={handleRevert}
            onToggleSidebar={() => setSidebarOpen(v => !v)}
            previewVisible={previewVisible}
            onTogglePreview={() => setPreviewVisible(v => !v)}
          />
        )}

        <div className={`edit-scroll${SCROLL_FULL_VIEWS.has(activeId) ? ' edit-scroll--full' : ''}${!hasToolbar ? ' edit-scroll--no-toolbar' : ''}`}>
          <Suspense fallback={null}>
          {activeId === 'media' ? (
            <MediaLibrary onMenuOpen={() => setSidebarOpen(true)} />
          ) : activeId === 'dashboard' ? (
            <Dashboard onMenuOpen={() => setSidebarOpen(true)} />
          ) : activeId === 'traffic-detail' ? (
            <TrafficDetail />
          ) : activeId === 'layout' ? (
            <LayoutPanel
              sections={draft.sections || []}
              onChange={updateSections}
              onPreviewScroll={handleTabChange}
              onDrawerChange={setLayoutDrawerSection}
              heroBackground={draft.hero?.background || DEFAULT_HERO_BACKGROUND}
              onHeroBackgroundChange={updateHeroBackground}
            />
          ) : activeId === 'guests' ? (
            <GuestList config={draft} onMenuOpen={() => setSidebarOpen(true)} />
          ) : activeId === 'whatsapp' ? (
            <WhatsApp config={draft} onMenuOpen={() => setSidebarOpen(true)} />
          ) : activeId === 'wishes' ? (
            <WishesList onMenuOpen={() => setSidebarOpen(true)} />
          ) : activeId === 'gifts' ? (
            <GiftConfirmations onMenuOpen={() => setSidebarOpen(true)} />
          ) : activeId === 'share' ? (
            <ShareSetup draft={draft} onFieldChange={updateField} />
          ) : activeSection ? (
            <SectionForm
              key={activeSection.id}
              schema={activeSection}
              draft={draft}
              onFieldChange={updateField}
              onArrayChange={updateArray}
              onTabChange={handleTabChange}
            />
          ) : null}
          </Suspense>
        </div>
      </main>

      <Suspense fallback={null}>
      <PreviewPanel
        ref={iframeRef}
        visible={previewVisible && !PREVIEW_HIDDEN_VIEWS.has(activeId)}
        onRefresh={() => setRefreshKey(k => k + 1)}
        activeLabel={activeLabel}
        refreshKey={refreshKey}
        activeSection={
          activeId === 'layout'
            ? (layoutDrawerSection ?? null)
            : (EDITOR_TO_SECTION[activeId] ?? null)
        }
      />
      </Suspense>

      {pendingNav !== null && (
        <NavGuardModal
          activeLabel={activeLabel}
          saving={saving}
          onSave={handleModalSave}
          onDiscard={handleModalDiscard}
          onCancel={handleModalCancel}
        />
      )}
    </div>
  )
}
