// Shown in place of any image field that hasn't been set yet, or whose
// configured file no longer exists (broken/leftover seed path).
export const PLACEHOLDER_IMAGE = '/assets/images/placeholder.svg'

export function imgSrc(value) {
  return value || PLACEHOLDER_IMAGE
}

// onError handler for <img> tags: swaps a broken src for the placeholder
// once, then stops listening to avoid loops if the placeholder is missing too.
export function handleImgError(e) {
  if (e.target.dataset.fallback) return
  e.target.dataset.fallback = '1'
  e.target.src = PLACEHOLDER_IMAGE
}
