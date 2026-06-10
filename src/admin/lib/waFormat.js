// WhatsApp markdown ↔ HTML conversion utilities
// Supported: *bold*, _italic_, ~strikethrough~, ```monospace```

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// WA markdown → HTML (for contentEditable, keeps \n as literal chars — use pre-wrap)
export function waToInlineHtml(text) {
  let html = escapeHtml(text)
  html = html.replace(/```([^`]+?)```/g, '<code>$1</code>')
  html = html.replace(/\*([^*\n]+?)\*/g, '<b>$1</b>')
  html = html.replace(/_([^_\n]+?)_/g, '<i>$1</i>')
  html = html.replace(/~([^~\n]+?)~/g, '<s>$1</s>')
  return html
}

// WA markdown → HTML (for read-only preview, converts \n → <br>)
export function waToPreviewHtml(text) {
  return waToInlineHtml(text).replace(/\n/g, '<br>')
}

// contentEditable DOM → WA markdown text
export function htmlToWaText(root) {
  let out = ''

  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      out += node.textContent
      return
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return

    const tag = node.tagName

    if (tag === 'BR') { out += '\n'; return }

    // Capture inner before/after for wrapping inline elements
    const before = out.length
    for (const child of node.childNodes) walk(child)
    const inner = out.slice(before)
    out = out.slice(0, before)

    if (tag === 'B' || tag === 'STRONG') {
      out += `*${inner}*`
    } else if (tag === 'I' || tag === 'EM') {
      out += `_${inner}_`
    } else if (tag === 'S' || tag === 'STRIKE' || tag === 'DEL') {
      out += `~${inner}~`
    } else if (tag === 'CODE') {
      out += `\`\`\`${inner}\`\`\``
    } else if (tag === 'DIV' || tag === 'P') {
      // contentEditable may wrap lines in divs as fallback — treat as newline
      if (before > 0) out += '\n'
      out += inner
    } else {
      // SPAN or unknown — treat as transparent
      out += inner
    }
  }

  walk(root)
  return out
}
