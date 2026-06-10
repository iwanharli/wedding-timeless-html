// One-off/maintenance script: re-compress all existing media files in a
// directory using the same pipeline as the upload endpoint. Only keeps the
// compressed result if it's smaller than the original; otherwise leaves the
// file untouched. Prints a before/after size report.
//
// Usage: node server/scripts/compress-existing-media.mjs <dir> [<dir2> ...]

import path from 'path'
import fs from 'fs'
import { IMAGE_EXT, VIDEO_EXT, AUDIO_EXT, compressImage, compressVideo, compressAudio } from '../lib/mediaCompress.js'

const dirs = process.argv.slice(2)
if (!dirs.length) {
  console.error('Usage: node compress-existing-media.mjs <dir> [<dir2> ...]')
  process.exit(1)
}

function fmt(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

let totalBefore = 0
let totalAfter = 0
const rows = []

for (const dir of dirs) {
  const fullDir = path.resolve(dir)
  if (!fs.existsSync(fullDir)) {
    console.error(`Skipping missing dir: ${fullDir}`)
    continue
  }

  for (const name of fs.readdirSync(fullDir)) {
    const ext = path.extname(name).toLowerCase()
    const fullPath = path.join(fullDir, name)
    if (!fs.statSync(fullPath).isFile()) continue

    const before = fs.statSync(fullPath).size

    try {
      if (IMAGE_EXT.has(ext)) {
        const compressed = await compressImage(fullPath, ext)
        if (compressed.length < before) {
          fs.writeFileSync(fullPath, compressed)
        }
      } else if (VIDEO_EXT.has(ext)) {
        const tmpPath = `${fullPath}.tmp.mp4`
        await compressVideo(fullPath, tmpPath)
        const compressedSize = fs.statSync(tmpPath).size
        if (ext === '.mp4' && compressedSize < before) {
          fs.renameSync(tmpPath, fullPath)
        } else {
          fs.unlinkSync(tmpPath)
        }
      } else if (AUDIO_EXT.has(ext)) {
        const tmpPath = `${fullPath}.tmp${ext}`
        await compressAudio(fullPath, tmpPath)
        const compressedSize = fs.statSync(tmpPath).size
        if (compressedSize < before) {
          fs.renameSync(tmpPath, fullPath)
        } else {
          fs.unlinkSync(tmpPath)
        }
      } else {
        continue
      }
    } catch (e) {
      console.error(`Failed to compress ${fullPath}: ${e.message}`)
      continue
    }

    const after = fs.statSync(fullPath).size
    totalBefore += before
    totalAfter += after
    rows.push({ name: path.relative(process.cwd(), fullPath), before, after })
  }
}

for (const r of rows) {
  const pct = r.before > 0 ? Math.round((1 - r.after / r.before) * 100) : 0
  console.log(`${r.name}: ${fmt(r.before)} -> ${fmt(r.after)} (-${pct}%)`)
}

console.log('---')
console.log(`Total before: ${fmt(totalBefore)}`)
console.log(`Total after:  ${fmt(totalAfter)}`)
console.log(`Saved:        ${fmt(totalBefore - totalAfter)} (${Math.round((1 - totalAfter / totalBefore) * 100)}%)`)
