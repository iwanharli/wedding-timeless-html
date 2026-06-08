import { useState } from 'react'

function formatRupiah(val) {
  const raw = val.replace(/\D/g, '')
  return raw.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export default function GiftPopup({ isOpen, onClose, gift = {} }) {
  const accounts = gift.accounts || []
  const defaultBank = accounts[0] ? `${accounts[0].bankName} — ${accounts[0].bankType}` : ''
  const [name, setName] = useState('')
  const [bank, setBank] = useState(defaultBank)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  function handleAmountChange(e) {
    setAmount(formatRupiah(e.target.value))
  }

  if (!isOpen) return null

  return (
    <div id="wedding-gift-popup" style={{ display: 'flex' }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="gift-popup-inner">
        <button className="gift-popup-close" onClick={onClose}>
          <i className="fas fa-times" />
        </button>

        <p className="gift-popup-label">Wedding Gift</p>
        <h3 className="gift-popup-title">{gift.popupTitle || 'Konfirmasi Hadiah'}</h3>

        <form id="wedding_gift" name="weddinggift">
          <div className="gift-popup-field">
            <label className="gift-popup-field-label">{gift.popupLabelName || 'Nama Lengkap'}</label>
            <input
              type="text"
              className="gift-popup-input"
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="gift-popup-field">
            <label className="gift-popup-field-label">{gift.popupLabelBank || 'Bank Tujuan'}</label>
            <div className="gift-popup-select-wrap">
              <select
                className="gift-popup-input gift-popup-select"
                required
                value={bank}
                onChange={e => setBank(e.target.value)}
              >
                {accounts.map((acc, i) => (
                  <option key={i} value={`${acc.bankName} — ${acc.bankType}`}>
                    {acc.bankName} — {acc.bankType}
                  </option>
                ))}
              </select>
              <i className="fas fa-chevron-down gift-popup-select-icon" />
            </div>
          </div>

          <div className="gift-popup-field">
            <label className="gift-popup-field-label">{gift.popupLabelAmount || 'Jumlah'}</label>
            <div className="gift-popup-amount-wrap">
              <span className="gift-popup-currency">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                className="gift-popup-input gift-popup-amount-input"
                placeholder="0"
                value={amount}
                onChange={handleAmountChange}
              />
            </div>
          </div>

          <div className="gift-popup-field">
            <label className="gift-popup-field-label">
              {gift.popupLabelNote || 'Catatan'}
              <span className="gift-popup-optional"> (opsional)</span>
            </label>
            <textarea
              className="gift-popup-input"
              rows="2"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          <button type="submit" className="gift-popup-submit">
            <i className="fas fa-paper-plane" />
            {gift.popupSubmitText || 'Kirim Konfirmasi'}
          </button>
        </form>
      </div>
    </div>
  )
}
