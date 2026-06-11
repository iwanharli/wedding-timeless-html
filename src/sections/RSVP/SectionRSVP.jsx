import { useState, useEffect, useRef } from 'react'
import { apiUrl } from '../../lib/api'
import './rsvp.css'

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
  const [errors, setErrors] = useState({})
  const slugRef = useRef(null)

  const notAttending = attendance === 'Tidak Hadir'

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const nameParam = params.get('to')
    if (nameParam) setName(decodeURIComponent(nameParam))

    const slug = params.get('g') || null
    slugRef.current = slug

    const maxParam = params.get('max')
    const resolvedMax = maxParam ? parseInt(maxParam, 10) : defaultMax
    setMaxGuests(resolvedMax)
    setGuestLabel(`${defaultLabel} (Max ${resolvedMax})`)

    // Restore submitted state so guest can't re-send by refreshing
    const key = `rsvp_done_${slug || 'open'}`
    if (sessionStorage.getItem(key)) setSubmitted(true)
  }, [])

  function handleAttendanceChange(value) {
    setAttendance(value)
    setErrors(v => ({ ...v, attendance: undefined }))
    if (value === 'Tidak Hadir') setGuests(0)
    else if (guests === 0) setGuests(1)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const newErrors = {}
    if (!name.trim()) newErrors.name = 'Please enter your name'
    if (!attendance) newErrors.attendance = 'Please select your attendance'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setErrors({})
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch(apiUrl('/api/rsvp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, attend: attendance, guests, wish: wishes, slug: slugRef.current }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Gagal mengirim')
      setSubmitted(true)
      const key = `rsvp_done_${slugRef.current || 'open'}`
      sessionStorage.setItem(key, '1')
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
            <i className="fas fa-check-circle" />
            <p>{r.successMessage || 'Terima kasih! RSVP kamu sudah diterima.'}</p>
          </div>
        )}

        <div className="rsvp-form-card">
        <form className="rsvp-form" id="commentform" name="comment_form" onSubmit={handleSubmit} style={submitted ? { display: 'none' } : {}}>
          {/* Name */}
          <div className="rsvp-field">
            <label htmlFor="field-name">Name</label>
            <input
              type="text"
              name="name"
              id="field-name"
              className={`rsvp-input${errors.name ? ' rsvp-input--error' : ''}`}
              value={name}
              onChange={e => { setName(e.target.value); setErrors(v => ({ ...v, name: undefined })) }}
            />
            {errors.name && <span className="rsvp-field-error">{errors.name}</span>}
          </div>

          {/* Attendance */}
          <div className="rsvp-field">
            <label>Attendance</label>
            <div className={`rsvp-radio-group${errors.attendance ? ' rsvp-radio-group--error' : ''}`}>
              <label className="rsvp-radio-label">
                <input
                  type="radio"
                  value="EXCITED TO ATTEND"
                  id="field-attendance-yes"
                  name="attendance"
                  checked={attendance === 'EXCITED TO ATTEND'}
                  onChange={e => handleAttendanceChange(e.target.value)}
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
                  onChange={e => handleAttendanceChange(e.target.value)}
                />
                <span>{r.maybeLabel || 'Mungkin Datang'}</span>
              </label>
              <label className="rsvp-radio-label">
                <input
                  type="radio"
                  value="Tidak Hadir"
                  id="field-attendance-no"
                  name="attendance"
                  checked={attendance === 'Tidak Hadir'}
                  onChange={e => handleAttendanceChange(e.target.value)}
                />
                <span>{r.unableLabel}</span>
              </label>
            </div>
            {errors.attendance && <span className="rsvp-field-error">{errors.attendance}</span>}
          </div>

          {/* Guest count — hidden when not attending */}
          {!notAttending && <div className="rsvp-field">
            <label>{guestLabel}</label>
            <div className="rsvp-stepper">
              <button
                type="button"
                className="rsvp-stepper-btn"
                onClick={() => setGuests(v => Math.max(1, v - 1))}
                disabled={guests <= 1}
              >−</button>
              <span className="rsvp-stepper-val">{guests}</span>
              <button
                type="button"
                className="rsvp-stepper-btn"
                onClick={() => setGuests(v => Math.min(maxGuests, v + 1))}
                disabled={guests >= maxGuests}
              >+</button>
            </div>
          </div>}

          {/* Wishes */}
          <div className="rsvp-field">
            <label htmlFor="field-wishes">Wishes</label>
            <textarea
              name="wishes"
              id="field-wishes"
              className="rsvp-textarea"
              rows="3"
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
    </div>
  )
}
