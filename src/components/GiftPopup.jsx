import { useState } from 'react'

export default function GiftPopup({ isOpen, onClose }) {
  const [name, setName] = useState('')
  const [bank, setBank] = useState('Groove Public Invitation (BCA)')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  if (!isOpen) return null

  return (
    <div
      id="wedding-gift-popup"
      style={{ display: 'flex' }}
    >
      <div className="gift-popup-inner">
        <h3>Wedding Gift</h3>
        <form
          id="wedding_gift"
          name="weddinggift"
          style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <div className="popup-field">
            <label className="popup-label">Full Name</label>
            <input
              type="text"
              name="name"
              id="gift-field-name"
              className="popup-input"
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="popup-field">
            <label className="popup-label">Recipient Bank</label>
            <select
              name="bank"
              id="gift-field-bank"
              className="popup-input popup-select"
              required
              value={bank}
              onChange={e => setBank(e.target.value)}
            >
              <option value="Groove Public Invitation (BCA)">Groove Public Invitation (BCA)</option>
              <option value="Groove Public Invitation (Mandiri)">Groove Public Invitation (Mandiri)</option>
            </select>
          </div>
          <div className="popup-field">
            <label className="popup-label">Amount</label>
            <input
              type="number"
              name="amount"
              id="gift-field-amount"
              className="popup-input"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
          <div className="popup-field">
            <label className="popup-label">Note (optional)</label>
            <textarea
              name="note"
              id="gift-field-note"
              className="popup-input"
              rows="3"
              value={note}
              onChange={e => setNote(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" id="wedding_gift_submit" className="popup-submit">Send</button>
        </form>
        <a className="gift-close-link" onClick={onClose} style={{ cursor: 'pointer' }}>Close</a>
      </div>
    </div>
  )
}
