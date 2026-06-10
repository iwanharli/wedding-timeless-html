const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif|avif|svg)(\?.*)?$/i

// Recursively walk the content object and collect every string value that
// looks like an image path (used for hero/section/gallery backgrounds, etc.)
export function collectImageUrls(value, found = new Set()) {
  if (!value) return found
  if (typeof value === 'string') {
    if (IMAGE_EXT_RE.test(value)) found.add(value)
    return found
  }
  if (Array.isArray(value)) {
    value.forEach(v => collectImageUrls(v, found))
    return found
  }
  if (typeof value === 'object') {
    Object.values(value).forEach(v => collectImageUrls(v, found))
  }
  return found
}

// Preload a list of image URLs, resolving once every image has either
// loaded or failed (a broken URL must not block the preloader forever).
export function preloadImages(urls) {
  if (!urls.length) return Promise.resolve()
  return Promise.all(
    urls.map(url => new Promise(resolve => {
      const img = new Image()
      img.onload = resolve
      img.onerror = resolve
      img.src = url
    }))
  )
}
