import { useEffect, useRef } from 'react'
import {
  CONTENT_IDS,
  SPECIAL_VIEWS,
  NON_SCROLLABLE_VIEWS,
  EDITOR_TO_SECTION,
  SECTION_TO_EDITOR,
} from './editorConstants'

// Keeps the editor and the live preview iframe in sync via postMessage:
// - editor → preview: scroll-to-section commands and live config updates
// - preview → editor: which section is currently visible (drives the route)
//
// Returns the iframe ref (passed to <PreviewPanel>) and a `handleTabChange`
// helper for components (SectionForm, LayoutPanel) that want to scroll the
// preview to a specific section without changing the route.
export function usePreviewSync({ activeId, draft, navigate }) {
  const iframeRef = useRef(null)
  // track whether we just sent a scroll command, to avoid echo-back loop
  const scrollingRef = useRef(false)
  // public site section ID we're waiting to arrive at (cleared once confirmed)
  const pendingSectionRef = useRef(null)

  function scrollPreviewTo(targetSection) {
    scrollingRef.current = true
    pendingSectionRef.current = targetSection
    if (targetSection && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'scrollToSection', id: targetSection },
        window.location.origin
      )
    }
    const t = setTimeout(() => {
      scrollingRef.current = false
      pendingSectionRef.current = null
    }, 2500)
    return () => clearTimeout(t)
  }

  function handleTabChange(sectionId) {
    if (!sectionId) return
    return scrollPreviewTo(sectionId)
  }

  function pushPreviewConfig() {
    if (!draft || !iframeRef.current?.contentWindow) return
    iframeRef.current.contentWindow.postMessage(
      {
        type: 'previewConfig',
        sections: draft.sections,
        heroBackground: draft.hero?.background,
      },
      window.location.origin
    )
  }

  // Editor → preview: scroll when section changes
  useEffect(() => {
    // Guard must activate for ALL content sections, even ones without a preview target
    // (e.g. 'general') — otherwise the iframe's initial sectionVisible message redirects us away
    if (!CONTENT_IDS.has(activeId)) return
    return scrollPreviewTo(EDITOR_TO_SECTION[activeId] || null)
  }, [activeId])

  // Editor → preview: live-sync section background/layout edits
  useEffect(() => {
    pushPreviewConfig()
  }, [draft?.sections, draft?.hero?.background])

  // Preview → editor: sync active section when user scrolls
  // Guard: skip for special views that don't map to content sections
  useEffect(() => {
    function handleMessage(e) {
      if (e.data?.type === 'previewReady') {
        if (draft && iframeRef.current?.contentWindow) {
          pushPreviewConfig()
          // Iframe just (re)loaded at the top — restore the scroll position
          // for the active section, guarding against a stray sectionVisible:'hero'
          // that would otherwise bounce the editor back to /admin/section/hero
          if (CONTENT_IDS.has(activeId)) {
            scrollPreviewTo(EDITOR_TO_SECTION[activeId] || null)
          }
        }
        return
      }
      if (e.data?.type !== 'sectionVisible') return
      // If we're waiting for a specific section, clear lock only when it arrives
      if (pendingSectionRef.current) {
        if (e.data.id === pendingSectionRef.current) {
          pendingSectionRef.current = null
          scrollingRef.current = false
        }
        return
      }
      if (scrollingRef.current) return
      if (SPECIAL_VIEWS.has(activeId) || NON_SCROLLABLE_VIEWS.has(activeId)) return
      const editorId = SECTION_TO_EDITOR[e.data.id]
      if (editorId) {
        const path = CONTENT_IDS.has(editorId) ? `/admin/section/${editorId}` : `/admin/${editorId}`
        navigate(path, { replace: true })
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [navigate, activeId, draft])

  return { iframeRef, handleTabChange }
}
