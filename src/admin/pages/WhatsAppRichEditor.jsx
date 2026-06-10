import { useRef, useEffect, useCallback } from 'react'
import { waToInlineHtml, htmlToWaText, escapeHtml } from '../lib/waFormat'

const FORMATS = [
  { cmd: 'bold',          label: <b>B</b>,              title: 'Bold  ·  *teks*',           key: 'b' },
  { cmd: 'italic',        label: <i>I</i>,              title: 'Italic  ·  _teks_',          key: 'i' },
  { cmd: 'strikeThrough', label: <s>S</s>,              title: 'Strikethrough  ·  ~teks~',   key: null },
  { cmd: 'code',          label: <span>{'</>'}</span>,  title: 'Monospace  ·  ```teks```',   key: null },
]

export default function WhatsAppRichEditor({ value, onChange, rows = 9 }) {
  const editorRef      = useRef(null)
  const lastEmittedRef = useRef(null)

  // Sync external value changes (initial load, revert) without clobbering internal edits
  useEffect(() => {
    if (!editorRef.current) return
    if (value === lastEmittedRef.current) return   // our own emit, skip
    const html = waToInlineHtml(value || '')
    editorRef.current.innerHTML = html
    // move caret to end
    const sel = window.getSelection()
    if (sel) {
      const range = document.createRange()
      range.selectNodeContents(editorRef.current)
      range.collapse(false)
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }, [value])

  const emitChange = useCallback(() => {
    if (!editorRef.current) return
    const waText = htmlToWaText(editorRef.current)
    lastEmittedRef.current = waText
    onChange(waText)
  }, [onChange])

  // Apply a format command; for 'code' we do a custom insertHTML
  function applyFormat(cmd) {
    editorRef.current?.focus()

    if (cmd === 'code') {
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0) return
      const text = sel.toString()
      if (!text) return
      document.execCommand('insertHTML', false, `<code>${escapeHtml(text)}</code>`)
    } else {
      document.execCommand('styleWithCSS', false, false)
      document.execCommand(cmd)
    }
    emitChange()
  }

  function handleKeyDown(e) {
    // Ctrl/Cmd+B → bold, Ctrl/Cmd+I → italic
    if (e.metaKey || e.ctrlKey) {
      const hit = FORMATS.find(f => f.key && f.key === e.key.toLowerCase())
      if (hit) { e.preventDefault(); applyFormat(hit.cmd); return }
    }
    // Enter → insert literal \n (keeps contentEditable free of block-level divs)
    if (e.key === 'Enter') {
      e.preventDefault()
      document.execCommand('insertText', false, '\n')
      emitChange()
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
    emitChange()
  }

  const minH = `${rows * 1.6}em`

  return (
    <div className="share-rte">
      <div className="share-rte-toolbar">
        {FORMATS.map(f => (
          <button
            key={f.cmd}
            type="button"
            className="share-rte-btn"
            title={f.title}
            onMouseDown={e => e.preventDefault()}   // keep focus + selection in editor
            onClick={() => applyFormat(f.cmd)}
          >
            {f.label}
          </button>
        ))}
        <span className="share-rte-hint">Pilih teks lalu klik format</span>
      </div>

      <div
        ref={editorRef}
        className="share-rte-content"
        contentEditable
        suppressContentEditableWarning
        style={{ minHeight: minH }}
        onInput={emitChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        data-placeholder="Ketik pesan undangan…"
      />
    </div>
  )
}
