import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { requireAuth } from './auth.js'
import { IMAGE_EXT, VIDEO_EXT, AUDIO_EXT, compressImage, compressVideo, compressAudio } from '../lib/mediaCompress.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = path.resolve(__dirname, '../../public/assets/uploads')

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 80 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    cb(null, /^(image|video|audio)\//.test(file.mimetype))
  },
})

export const uploadRouter = express.Router()

uploadRouter.post('/', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No valid file received' })

  const ext = path.extname(req.file.filename).toLowerCase()
  const fullPath = path.join(UPLOADS_DIR, req.file.filename)

  try {
    if (IMAGE_EXT.has(ext)) {
      const compressed = await compressImage(fullPath, ext)
      fs.writeFileSync(fullPath, compressed)
    } else if (VIDEO_EXT.has(ext)) {
      const outName = req.file.filename.replace(/\.[^.]+$/, '.mp4')
      const outPath = path.join(UPLOADS_DIR, outName)
      const tmpPath = `${outPath}.tmp.mp4`
      await compressVideo(fullPath, tmpPath)
      fs.renameSync(tmpPath, outPath)
      if (outPath !== fullPath) fs.unlinkSync(fullPath)
      return res.json({ url: `/assets/uploads/${outName}` })
    } else if (AUDIO_EXT.has(ext)) {
      const tmpPath = `${fullPath}.tmp${ext}`
      await compressAudio(fullPath, tmpPath)
      fs.renameSync(tmpPath, fullPath)
    }
  } catch (e) {
    console.error('Media compression failed, keeping original file:', e.message)
  }

  res.json({ url: `/assets/uploads/${req.file.filename}` })
})
