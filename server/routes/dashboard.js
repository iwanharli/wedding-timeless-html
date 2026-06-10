import { Router } from 'express'
import { pool } from '../db/db.js'
import { requireAuth } from './auth.js'

export const dashboardRouter = Router()

dashboardRouter.get('/', requireAuth, async (req, res) => {
  const [
    guestTotal,
    guestByCategory,
    guestWithPhone,
    guestRecent,
    guestPending,
    rsvpAll,
    rsvpLinked,
    rsvpTotalPax,
    wishesTotal,
    wishesRecent,
  ] = await Promise.all([

    pool.query('SELECT COUNT(*)::int AS count FROM guests'),

    pool.query(`
      SELECT COALESCE(NULLIF(category,''), 'Lainnya') AS category, COUNT(*)::int AS count
      FROM guests GROUP BY 1 ORDER BY 2 DESC
    `),

    pool.query(`SELECT COUNT(*)::int AS count FROM guests WHERE phone IS NOT NULL AND phone <> ''`),

    pool.query(`SELECT COUNT(*)::int AS count FROM guests WHERE created_at >= now() - interval '7 days'`),

    // guests in the list who have NOT responded via their personal slug
    pool.query(`
      SELECT COUNT(*)::int AS count FROM guests
      WHERE slug NOT IN (SELECT DISTINCT slug FROM rsvp WHERE slug IS NOT NULL)
    `),

    // all rsvp responses (personal + public) — used for stat cards
    pool.query(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE attend = 'EXCITED TO ATTEND')::int AS attending,
        COUNT(*) FILTER (WHERE attend = 'Mungkin Datang')::int  AS maybe,
        COUNT(*) FILTER (WHERE attend = 'Tidak Hadir')::int     AS not_attending
      FROM rsvp
    `),

    // rsvp responses linked to guest list only — used for rate bar (sums to = guests.total)
    pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE attend = 'EXCITED TO ATTEND')::int AS attending,
        COUNT(*) FILTER (WHERE attend = 'Mungkin Datang')::int    AS maybe,
        COUNT(*) FILTER (WHERE attend = 'Tidak Hadir')::int       AS not_attending
      FROM rsvp
      WHERE slug IN (SELECT slug FROM guests WHERE slug IS NOT NULL)
    `),

    pool.query(`
      SELECT COALESCE(SUM(guests), 0)::int AS total
      FROM rsvp WHERE attend = 'EXCITED TO ATTEND'
    `),

    pool.query(`
      SELECT COUNT(*)::int AS count FROM rsvp
      WHERE wish IS NOT NULL AND wish <> ''
    `),

    pool.query(`
      SELECT name, wish AS message, "createdAt"
      FROM rsvp
      WHERE wish IS NOT NULL AND wish <> ''
      ORDER BY "createdAt" DESC LIMIT 5
    `),
  ])

  const guestTotalNum   = guestTotal.rows[0].count
  const pendingNum      = guestPending.rows[0].count
  const guestsResponded = guestTotalNum - pendingNum
  const linked          = rsvpLinked.rows[0]

  res.json({
    guests: {
      total:      guestTotalNum,
      byCategory: guestByCategory.rows,
      withPhone:  guestWithPhone.rows[0].count,
      recentWeek: guestRecent.rows[0].count,
      responded:  guestsResponded,
    },
    rsvp: {
      total:        rsvpAll.rows[0].total,
      attending:    rsvpAll.rows[0].attending,
      maybe:        rsvpAll.rows[0].maybe,
      notAttending: rsvpAll.rows[0].not_attending,
      pending:      pendingNum,
      totalPax:     rsvpTotalPax.rows[0].total,
      // from guest list only — used for rate bar (sums to guests.total)
      linkedAttending:    linked.attending,
      linkedMaybe:        linked.maybe,
      linkedNotAttending: linked.not_attending,
    },
    wishes: {
      total:  wishesTotal.rows[0].count,
      recent: wishesRecent.rows,
    },
  })
})
