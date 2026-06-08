/**
 * migrate.js — Complete database migration for timeless-wedding
 *
 * Creates all tables, indexes, and default data needed for a fresh install.
 * Safe to run multiple times (uses IF NOT EXISTS / ON CONFLICT).
 *
 * Usage:
 *   node server/migrate.js
 *
 * Tables:
 *   1. admins          — admin users for CMS auth
 *   2. wedding_config  — single-row JSONB config store
 *   3. guests          — guest list with personal slugs
 *   4. rsvp            — RSVP responses & wishes
 *   5. page_visits     — page view tracking
 *   6. wishes          — standalone guest wishes (legacy)
 */

import 'dotenv/config'
import bcrypt from 'bcrypt'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })

// ─── helpers ─────────────────────────────────────────────────────────────────
const log = (msg) => console.log(`  ✓ ${msg}`)
const err = (msg, e) => { console.error(`  ✗ ${msg}:`, e.message); throw e }

// ─── 1. admins ───────────────────────────────────────────────────────────────
async function createAdmins(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id              SERIAL PRIMARY KEY,
      username        TEXT        NOT NULL UNIQUE,
      "passwordHash"  TEXT        NOT NULL,
      "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
  log('admins table ready')

  // Seed default admin (admin / admin) — password should be changed via SEED_ADMIN_PASSWORD
  const defaultPassword = process.env.SEED_ADMIN_PASSWORD || 'admin'
  const hash = await bcrypt.hash(defaultPassword, 12)

  await client.query(`
    INSERT INTO admins (username, "passwordHash")
    VALUES ('admin', $1)
    ON CONFLICT (username) DO NOTHING
  `, [hash])
  log('default admin user ensured')
}

// ─── 2. wedding_config ──────────────────────────────────────────────────────
async function createWeddingConfig(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS wedding_config (
      id              INTEGER     NOT NULL PRIMARY KEY DEFAULT 1,
      data            JSONB       NOT NULL,
      "updatedAt"     TIMESTAMP(3) NOT NULL
    )
  `)
  log('wedding_config table ready')
}

// ─── 3. guests ──────────────────────────────────────────────────────────────
async function createGuests(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS guests (
      id              SERIAL PRIMARY KEY,
      name            TEXT        NOT NULL,
      phone           TEXT        DEFAULT '',
      category        TEXT        DEFAULT '',
      table_number    TEXT        DEFAULT '',
      notes           TEXT        DEFAULT '',
      created_at      TIMESTAMPTZ DEFAULT now(),
      slug            TEXT        UNIQUE
    )
  `)

  // Index for slug lookups (public invitation links)
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_guests_slug ON guests (slug) WHERE slug IS NOT NULL
  `)

  // Index for category filtering on dashboard
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_guests_category ON guests (category)
  `)

  log('guests table ready')
}

// ─── 4. rsvp ────────────────────────────────────────────────────────────────
async function createRsvp(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS rsvp (
      id              SERIAL PRIMARY KEY,
      name            TEXT        NOT NULL,
      attend          TEXT        NOT NULL,
      guests          INTEGER     NOT NULL DEFAULT 1,
      wish            TEXT,
      "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      slug            TEXT,
      visible         BOOLEAN     DEFAULT true
    )
  `)

  // Index for slug joins (linking RSVP to guest list)
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_rsvp_slug ON rsvp (slug) WHERE slug IS NOT NULL
  `)

  // Index for public wishes query (visible + non-empty wish)
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_rsvp_visible_wish ON rsvp (visible, "createdAt" DESC)
    WHERE wish IS NOT NULL AND wish <> ''
  `)

  log('rsvp table ready')
}

// ─── 5. page_visits ─────────────────────────────────────────────────────────
async function createPageVisits(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS page_visits (
      id              SERIAL PRIMARY KEY,
      slug            TEXT,
      visited_at      TIMESTAMPTZ DEFAULT now()
    )
  `)

  // Index for the 14-day stats query on dashboard
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_page_visits_visited_at ON page_visits (visited_at)
  `)

  log('page_visits table ready')
}

// ─── 6. wishes ──────────────────────────────────────────────────────────────
async function createWishes(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS wishes (
      id              SERIAL PRIMARY KEY,
      name            TEXT        NOT NULL,
      message         TEXT        NOT NULL,
      "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  log('wishes table ready')
}

// ─── Run all migrations ─────────────────────────────────────────────────────
async function migrate() {
  console.log('\n🔧 Running database migrations...\n')
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    await createAdmins(client)
    await createWeddingConfig(client)
    await createGuests(client)
    await createRsvp(client)
    await createPageVisits(client)
    await createWishes(client)

    await client.query('COMMIT')
    console.log('\n✅ All migrations completed successfully!\n')
  } catch (e) {
    await client.query('ROLLBACK')
    console.error('\n❌ Migration failed, rolled back:', e.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

migrate()
