import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../db/db.js'

const JWT_SECRET = process.env.JWT_SECRET
const TOKEN_TTL = '7d'

export const authRouter = Router()

authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' })
  }

  const result = await pool.query('SELECT id, username, "passwordHash", role FROM admins WHERE username = $1', [username])
  const admin = result.rows[0]
  if (!admin) {
    return res.status(401).json({ error: 'Invalid username or password' })
  }

  const matches = await bcrypt.compare(password, admin.passwordHash)
  if (!matches) {
    return res.status(401).json({ error: 'Invalid username or password' })
  }

  const token = jwt.sign({ sub: admin.id, username: admin.username, role: admin.role }, JWT_SECRET, { expiresIn: TOKEN_TTL })
  res.json({ token, username: admin.username, role: admin.role })
})

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ username: req.user.username, role: req.user.role })
})

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' })
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// Restricts to the 'admin' role — call after requireAuth
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: admin role required' })
  }
  next()
}
