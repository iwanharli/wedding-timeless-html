// Only the images visible on the cover screen before the invitation is
// opened. Everything else (gallery, profile photos, section backgrounds,
// etc.) loads lazily as the user scrolls, so it shouldn't block the
// preloader.
export function collectCoverImageUrls(content) {
  const found = new Set()
  const hero = content?.hero || {}
  if (hero.background?.type === 'image' && hero.background.value) found.add(hero.background.value)
  if (hero.leftPanel?.type === 'image' && hero.leftPanel.image) found.add(hero.leftPanel.image)
  return found
}

// Preload a list of image URLs, resolving once every image has either
// loaded or failed (a broken URL must not block the preloader forever).
// `onProgress(done, total)` is called after each image settles, so callers
// can drive a real progress bar instead of a fake one.
export function preloadImages(urls, onProgress) {
  const total = urls.length
  if (!total) {
    onProgress?.(1, 1)
    return Promise.resolve()
  }
  let done = 0
  return Promise.all(
    urls.map(url => new Promise(resolve => {
      const img = new Image()
      const settle = () => { done += 1; onProgress?.(done, total); resolve() }
      img.onload = settle
      img.onerror = settle
      img.src = url
    }))
  )
}
