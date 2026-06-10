// Only the images visible on the cover screen before the invitation is
// opened. Everything else (gallery, profile photos, section backgrounds,
// etc.) loads lazily as the user scrolls, so it shouldn't block the
// preloader.
export function collectCoverImageUrls(content) {
  const found = new Set()
  const hero = content?.hero || {}
  if (hero.background?.type === 'image' && hero.background.value) found.add(hero.background.value)
  if (hero.leftPanel?.type === 'image' && hero.leftPanel.image) found.add(hero.leftPanel.image)
  if (hero.backgroundOverlayImage) found.add(hero.backgroundOverlayImage)
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
