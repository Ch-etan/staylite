import { useState } from 'react'
import { api } from './api'
import { money } from './format'
import { digits, expiryOk, isValidPhone, isValidUpi, luhnOk, normPhone } from './payment'

const METHODS = [
  { key: 'UPI', label: 'UPI' },
  { key: 'CARD', label: 'Card' },
  { key: 'NETBANKING', label: 'Net banking' },
]
const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank']

export default function Checkout({ listing, checkIn, checkOut, guests, nights, onClose, onPaid }) {
  const total = nights * Number(listing.pricePerNight)
  const [phone, setPhone] = useState('')
  const [requests, setRequests] = useState('')
  const [method, setMethod] = useState('UPI')
  const [upi, setUpi] = useState('')
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [bank, setBank] = useState(BANKS[0])
  const [terms, setTerms] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const setC = (k) => (e) => setCard({ ...card, [k]: e.target.value })

  function validate() {
    if (!isValidPhone(phone)) return 'Enter a valid 10-digit mobile number'
    if (method === 'UPI' && !isValidUpi(upi)) return 'Enter a valid UPI ID, like name@bank'
    if (method === 'CARD') {
      if (!luhnOk(card.number)) return 'Enter a valid card number'
      if (!card.name.trim()) return 'Enter the name on the card'
      if (!expiryOk(card.expiry)) return 'Enter a valid expiry date as MM/YY'
      if (!/^\d{3,4}$/.test(card.cvv)) return 'Enter the 3 or 4 digit CVV'
    }
    if (!terms) return 'Please accept the booking terms'
    return ''
  }

  async function pay(e) {
    e.preventDefault()
    const problem = validate()
    if (problem) { setError(problem); return }
    setBusy(true)
    setError('')
    try {
      await new Promise((r) => setTimeout(r, 1500))   // pretend to talk to a payment gateway
      // Only the method is sent. Card, UPI and bank details never leave the browser.
      const booking = await api.book({
        listingId: listing.id,
        checkIn,
        checkOut,
        guests: Number(guests),
        phone: normPhone(phone),
        specialRequests: requests.trim(),
        paymentMethod: method,
        acceptTerms: terms,
      })
      onPaid(booking)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={busy ? undefined : onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={pay} noValidate>
        <h2>Confirm and pay</h2>
        <div className="summary-box">
          <strong>{listing.title}</strong>
          <div className="muted">{listing.city}</div>
          <div>{checkIn} → {checkOut} · {nights} night{nights > 1 ? 's' : ''} · {guests} guest{Number(guests) > 1 ? 's' : ''}</div>
          <div className="summary-total">Total due now: <strong>{money(total)}</strong></div>
        </div>

        <p className="demo-note">Demo payment: no real money is charged, and card details are never sent to our server.</p>

        <label>Mobile number
          <input value={phone} onChange={(e) => setPhone(e.target.value)}
                 placeholder="98765 43210" inputMode="tel" autoComplete="tel" />
        </label>
        <label>Special requests <span className="muted">(optional)</span>
          <textarea rows="2" maxLength={500} value={requests} onChange={(e) => setRequests(e.target.value)}
                    placeholder="Late check-in, extra bed, dietary needs…" />
        </label>

        <div className="pay-title">Pay with</div>
        <div className="seg">
          {METHODS.map((m) => (
            <button key={m.key} type="button" className={method === m.key ? 'active' : ''}
                    onClick={() => setMethod(m.key)}>{m.label}</button>
          ))}
        </div>

        {method === 'UPI' && (
          <label>UPI ID
            <input value={upi} onChange={(e) => setUpi(e.target.value)} placeholder="name@bank" autoComplete="off" />
          </label>
        )}
        {method === 'CARD' && (
          <>
            <label>Card number
              <input value={card.number} inputMode="numeric" autoComplete="off" placeholder="4242 4242 4242 4242"
                     onChange={(e) => setCard({ ...card, number: digits(e.target.value).slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ') })} />
            </label>
            <label>Name on card
              <input value={card.name} onChange={setC('name')} autoComplete="off" />
            </label>
            <div className="two-col">
              <label>Expiry
                <input value={card.expiry} placeholder="MM/YY" maxLength={5} autoComplete="off"
                       onChange={(e) => {
                         const d = digits(e.target.value).slice(0, 4)
                         setCard({ ...card, expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d })
                       }} />
              </label>
              <label>CVV
                <input type="password" value={card.cvv} inputMode="numeric" maxLength={4} autoComplete="off"
                       onChange={(e) => setCard({ ...card, cvv: digits(e.target.value) })} />
              </label>
            </div>
            <p className="muted small">Test card: 4242 4242 4242 4242, any future expiry, any CVV.</p>
          </>
        )}
        {method === 'NETBANKING' && (
          <label>Choose your bank
            <select value={bank} onChange={(e) => setBank(e.target.value)}>
              {BANKS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </label>
        )}

        <label className="check">
          <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
          I agree to pay in advance. Free cancellation until the day before check-in, with a full refund.
        </label>

        {error && <p className="error">{error}</p>}
        <button className="primary" disabled={busy}>
          {busy ? 'Processing payment…' : `Pay ${money(total)} and confirm`}
        </button>
        <button type="button" className="link-btn" onClick={onClose} disabled={busy}>Back</button>
      </form>
    </div>
  )
}