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

// The shared cover background video plays behind every section, so it
// needs to be ready before the preloader hides too.
export function collectCoverVideoUrls(content) {
  const found = new Set()
  const video = content?.hero?.backgroundVideo
  if (video) found.add(video)
  return found
}

function isVideoUrl(url) {
  return /\.(mp4|mov|webm|ogg)(\?|$)/i.test(url || '')
}

// Preload a list of image/video URLs, resolving once every asset has either
// loaded enough to play or failed (a broken URL must not block the
// preloader forever). Videos resolve once they can play through without
// buffering, with a timeout fallback for slow/huge files.
// `onProgress(done, total)` is called after each asset settles, so callers
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
      const settle = () => { done += 1; onProgress?.(done, total); resolve() }

      if (isVideoUrl(url)) {
        const video = document.createElement('video')
        video.muted = true
        video.playsInline = true
        video.preload = 'auto'
        let settled = false
        const finish = () => { if (!settled) { settled = true; settle() } }
        video.addEventListener('canplaythrough', finish, { once: true })
        video.addEventListener('error', finish, { once: true })
        // Don't let a slow/huge video block the preloader indefinitely.
        setTimeout(finish, 10000)
        video.src = url
        video.load()
        return
      }

      const img = new Image()
      img.onload = settle
      img.onerror = settle
      img.src = url
    }))
  )
}
