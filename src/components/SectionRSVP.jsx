import { useState, useEffect } from 'react'

export default function SectionRSVP({ content }) {
  const r = content.rsvp
  const [guests, setGuests] = useState(1)
  const [maxGuests, setMaxGuests] = useState(2)
  const [name, setName] = useState('')
  const [attendance, setAttendance] = useState('')
  const [wishes, setWishes] = useState('')
  const [guestLabel, setGuestLabel] = useState('No of Guest')

  useEffect(() => {
    // Read URL param ?to= for name pre-fill
    const params = new URLSearchParams(window.location.search)
    const nameParam = params.get('to')
    if (nameParam) setName(decodeURIComponent(nameParam))

    // Read URL param ?max= for max guests
    const maxParam = params.get('max')
    if (maxParam) {
      const m = parseInt(maxParam, 10)
      setMaxGuests(m)
      setGuestLabel(`No of Guest (Max ${m})`)
    } else {
      setGuestLabel(`No of Guest (Max ${maxGuests})`)
    }
  }, [])

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

        <form className="rsvp-form" id="commentform" name="comment_form">
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
          <button className="rsvp-submit" type="submit" id="send-comment">
            <span>{r.submitButtonText}</span>
          </button>
        </form>
      </div>
    </div>
  )
}
