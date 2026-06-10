import { getToken } from '../auth/authClient'
import { apiUrl } from '../../lib/api'

// Uploads a file via XHR so we can report real upload progress, then a
// "processing" phase while the server compresses the file (no progress
// signal available for that part — it's reported as indeterminate).
export function uploadFileWithProgress(file, onProgress) {
  return new Promise((resolve, reject) => {
    const fd = new FormData()
    fd.append('file', file)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', apiUrl('/api/upload'))
    const token = getToken()
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)

    xhr.upload.onprogress = e => {
      if (!onProgress || !e.lengthComputable) return
      onProgress({ phase: 'uploading', percent: Math.round((e.loaded / e.total) * 100) })
    }
    xhr.upload.onload = () => {
      onProgress?.({ phase: 'processing', percent: 100 })
    }
    xhr.onload = () => {
      let body = {}
      try { body = JSON.parse(xhr.responseText) } catch { /* ignore */ }
      if (xhr.status >= 200 && xhr.status < 300) resolve(body.url)
      else reject(new Error(body.error || `Upload failed (${xhr.status})`))
    }
    xhr.onerror = () => reject(new Error('Upload failed (network error)'))
    xhr.send(fd)
  })
}
