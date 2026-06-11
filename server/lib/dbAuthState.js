import { proto, BufferJSON, initAuthCreds } from '@whiskeysockets/baileys'
import { pool } from '../db/db.js'

/**
 * Stores the Baileys authentication state (creds + signal keys) in the
 * `wa_session` table instead of the filesystem. Mirrors the interface
 * of `useMultiFileAuthState`.
 */
export async function useDbAuthState() {
  const readData = async (key) => {
    const { rows } = await pool.query('SELECT value FROM wa_session WHERE key = $1', [key])
    if (!rows.length) return null
    // value is stored as a JSON string so BufferJSON.reviver can restore Buffers/Uint8Arrays
    return JSON.parse(rows[0].value, BufferJSON.reviver)
  }

  const writeData = async (key, data) => {
    const value = JSON.stringify(data, BufferJSON.replacer)
    await pool.query(
      `INSERT INTO wa_session (key, value, "updatedAt") VALUES ($1, $2::jsonb, now())
       ON CONFLICT (key) DO UPDATE SET value = $2::jsonb, "updatedAt" = now()`,
      [key, value]
    )
  }

  const removeData = async (key) => {
    await pool.query('DELETE FROM wa_session WHERE key = $1', [key])
  }

  const creds = (await readData('creds')) || initAuthCreds()

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data = {}
          await Promise.all(ids.map(async (id) => {
            let value = await readData(`${type}-${id}`)
            if (type === 'app-state-sync-key' && value) {
              value = proto.Message.AppStateSyncKeyData.fromObject(value)
            }
            data[id] = value
          }))
          return data
        },
        set: async (data) => {
          const tasks = []
          for (const category in data) {
            for (const id in data[category]) {
              const value = data[category][id]
              const key = `${category}-${id}`
              tasks.push(value ? writeData(key, value) : removeData(key))
            }
          }
          await Promise.all(tasks)
        },
      },
    },
    saveCreds: () => writeData('creds', creds),
  }
}

export async function clearAuthState() {
  await pool.query('DELETE FROM wa_session')
}
