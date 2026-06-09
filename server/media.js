import { Router } from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { requireAuth } from './auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS_DIR = path.resolve(__dirname, '../public/assets')

const IMAGE_EXT  = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'])
const VIDEO_EXT  = new Set(['.mp4', '.mov', '.webm', '.ogv'])
const AUDIO_EXT  = new Set(['.mp3', '.ogg', '.wav', '.flac', '.aac', '.m4a'])

function mediaType(ext) {
  if (IMAGE_EXT.has(ext)) return 'image'
  if (VIDEO_EXT.has(ext)) return 'video'
  if (AUDIO_EXT.has(ext)) return 'audio'
  return 'other'
}

function scanFolder(relFolder) {
  const abs = path.join(ASSETS_DIR, relFolder)
  if (!fs.existsSync(abs)) return []
  return fs.readdirSync(abs)
    .filter(f => !f.startsWith('.'))
    .map(f => {
      const ext  = path.extname(f).toLowerCase()
      const stat = fs.statSync(path.join(abs, f))
      return {
        filename: f,
        url:      `/assets/${relFolder}/${f}`,
        folder:   relFolder,
        type:     mediaType(ext),
        ext:      ext.slice(1),
        size:     stat.size,
        mtime:    stat.mtimeMs,
      }
    })
    .sort((a, b) => b.mtime - a.mtime)
}

export const mediaRouter = Router()

// GET /api/media — list all assets
mediaRouter.get('/', requireAuth, (req, res) => {
  const { folder, type } = req.query
  const folders = folder ? [folder] : ['images', 'media', 'uploads']
  let files = folders.flatMap(scanFolder)
  if (type) files = files.filter(f => f.type === type)
  res.json(files)
})

// DELETE /api/media — delete an uploaded file (uploads/ only)
mediaRouter.delete('/', requireAuth, (req, res) => {
  const { filename } = req.body
  if (!filename || filename.includes('..') || filename.includes('/')) {
    return res.status(400).json({ error: 'Invalid filename' })
  }
  const abs = path.join(ASSETS_DIR, 'uploads', filename)
  if (!fs.existsSync(abs)) return res.status(404).json({ error: 'Not found' })
  fs.unlinkSync(abs)
  res.status(204).end()
})
