// Post-build script: purge unused FontAwesome CSS rules from dist/
// Scans all src/ files for FA class names and removes rules for icons not used anywhere.
// Runs automatically after `npm run build` via the build script in package.json.
import { PurgeCSS } from 'purgecss'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

function findFiles(dir, pattern) {
  const results = []
  if (!fs.existsSync(dir)) return results
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) results.push(...findFiles(full, pattern))
    else if (pattern.test(entry.name)) results.push(full)
  }
  return results
}

const faCssDir = path.join(root, 'dist/assets/vendor/font-awesome/css')
const cssFiles = fs.existsSync(faCssDir)
  ? fs.readdirSync(faCssDir).filter(f => f.endsWith('.css'))
  : []

if (!cssFiles.length) {
  console.log('⚠  No FA CSS found in dist — skipping purge')
  process.exit(0)
}

const faCssPath = path.join(faCssDir, cssFiles[0])
const sizeBefore = fs.statSync(faCssPath).size

// Collect all source content for PurgeCSS to scan
const srcFiles = findFiles(path.join(root, 'src'), /\.(jsx?|tsx?|css)$/)
const content = [
  // Ensure base FA modifier classes are always kept
  { raw: '.fas .fab .far .fal .fa ', extension: 'html' },
  ...srcFiles.map(f => ({ raw: fs.readFileSync(f, 'utf8'), extension: path.extname(f).slice(1) })),
  { raw: fs.readFileSync(path.join(root, 'index.html'), 'utf8'), extension: 'html' },
]

const [result] = await new PurgeCSS().purge({
  content,
  css: [{ raw: fs.readFileSync(faCssPath, 'utf8') }],
  fontFace: false,   // keep all @font-face (fonts needed for icon rendering)
  keyframes: false,
  variables: false,
  defaultExtractor: c => c.match(/[\w-:./]+/g) || [],
})

fs.writeFileSync(faCssPath, result.css)
const sizeAfter = fs.statSync(faCssPath).size
const saved = ((sizeBefore - sizeAfter) / 1024).toFixed(1)
console.log(`✓ FA CSS purged: ${(sizeBefore / 1024).toFixed(0)} KB → ${(sizeAfter / 1024).toFixed(0)} KB (saved ${saved} KB)`)
