const YOUTUBE_ID_RE = /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/

export function getYoutubeId(url) {
  if (!url) return null
  const match = url.match(YOUTUBE_ID_RE)
  return match ? match[1] : null
}

export function getYoutubeThumbnail(url, quality = 'hqdefault') {
  const id = getYoutubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/${quality}.jpg` : null
}
