import { useState, useEffect, useRef } from 'react'

export default function SectionRSVP({ content }) {
  const r = content.rsvp
  const defaultMax = Number(r.maxGuests) || 2
  const defaultLabel = r.guestLabel || 'No of Guest'

  const [guests, setGuests] = useState(1)
  const [maxGuests, setMaxGuests] = useState(defaultMax)
  const [name, setName] = useState('')
  const [attendance, setAttendance] = useState('')
  const [wishes, setWishes] = useState('')
  const [guestLabel, setGuestLabel] = useState(defaultLabel)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const slugRef = useRef(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const nameParam = params.get('to')
    if (nameParam) setName(decodeURIComponent(nameParam))

    slugRef.current = params.get('g') || null

    const maxParam = params.get('max')
    const resolvedMax = maxParam ? parseInt(maxParam, 10) : defaultMax
    setMaxGuests(resolvedMax)
    setGuestLabel(`${defaultLabel} (Max ${resolvedMax})`)
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !attendance) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, attend: attendance, guests, wish: wishes, slug: slugRef.current }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Gagal mengirim')
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div id="rsvp" className="section-rsvp child">
      <div className="rsvp-inner">
        <h2
          className="rsvp-title field-hidden"
          data-aos="fade"
          data-aos-offset="0"
          data-aos-delay="400"
          data-aos-duration="1000"
        >
          {r.title}
        </h2>

        <p
          className="rsvp-desc"
          data-aos="fade"
          data-aos-offset="0"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          {r.description}
        </p>

        {submitted && (
          <div className="rsvp-success">
            <p>{r.successMessage || 'Terima kasih! RSVP kamu sudah diterima.'}</p>
          </div>
        )}

        <form className="rsvp-form" id="commentform" name="comment_form" onSubmit={handleSubmit} style={submitted ? { display: 'none' } : {}}>
          {/* Name */}
          <div className="rsvp-field">
            <label htmlFor="field-name">Name</label>
            <input
              type="text"
              name="name"
              id="field-name"
              className="rsvp-input"
              required
              aria-required="true"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Attendance */}
          <div className="rsvp-field">
            <label>Attendance</label>
            <div className="rsvp-radio-group">
              <label className="rsvp-radio-label">
                <input
                  type="radio"
                  value="EXCITED TO ATTEND"
                  id="field-attendance-yes"
                  name="attendance"
                  required
                  aria-required="true"
                  checked={attendance === 'EXCITED TO ATTEND'}
                  onChange={e => setAttendance(e.target.value)}
                />
                <span>{r.attendanceLabel}</span>
              </label>
              <label className="rsvp-radio-label">
                <input
                  type="radio"
                  value="Mungkin Datang"
                  id="field-attendance-maybe"
                  name="attendance"
                  checked={attendance === 'Mungkin Datang'}
                  onChange={e => setAttendance(e.target.value)}
                />
                <span>{r.maybeLabel || 'Mungkin Datang'}</span>
              </label>
              <label className="rsvp-radio-label">
                <input
                  type="radio"
                  value="Tidak Hadir"
                  id="field-attendance-no"
                  name="attendance"
                  required
                  aria-required="true"
                  checked={attendance === 'Tidak Hadir'}
                  onChange={e => setAttendance(e.target.value)}
                />
                <span>{r.unableLabel}</span>
              </label>
            </div>
          </div>

          {/* Guest count */}
          <div className="rsvp-field">
            <label htmlFor="field-guests">{guestLabel}</label>
            <div className="number-input-wrapper">
              <input
                type="number"
                name="guests"
                id="field-guests"
                className="rsvp-input"
                value={guests}
                required
                aria-required="true"
                min="1"
                max={maxGuests}
                onChange={e => setGuests(parseInt(e.target.value, 10) || 1)}
              />
              <span
                className="decrement-text"
                onClick={() => setGuests(v => Math.max(1, v - 1))}
              >-</span>
              <span
                className="increment-text"
                onClick={() => setGuests(v => Math.min(maxGuests, v + 1))}
              >+</span>
            </div>
          </div>

          {/* Wishes */}
          <div className="rsvp-field">
            <label htmlFor="field-wishes">Wishes</label>
            <textarea
              name="wishes"
              id="field-wishes"
              className="rsvp-textarea"
              rows="4"
              value={wishes}
              onChange={e => setWishes(e.target.value)}
            ></textarea>
          </div>

          {/* Submit */}
          {submitError && <p className="rsvp-error">{submitError}</p>}
          <button className="rsvp-submit" type="submit" id="send-comment" disabled={submitting}>
            <span>{submitting ? 'Mengirim…' : r.submitButtonText}</span>
          </button>
        </form>
      </div>
    </div>
  )
}
