import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from '../api'
import { fmtDate, methodLabel, money, statusLabel } from '../format'
import { useAuth } from '../AuthContext.jsx'

export default function MyBookings() {
  const { user } = useAuth()
  const location = useLocation()
  const justBooked = location.state?.booking
  const [bookings, setBookings] = useState([])
  const [listings, setListings] = useState({})
  const [error, setError] = useState('')
  const [tick, setTick] = useState(0)   // bump to reload the list

  useEffect(() => {
    Promise.all([api.myBookings(), api.listings()])
      .then(([b, l]) => {
        setBookings(b)
        setListings(Object.fromEntries(l.map((x) => [x.id, x])))
        setError('')
      })
      .catch((e) => setError(e.message))
  }, [tick])

  async function cancel(id) {
    if (!window.confirm('Cancel this booking? You will get a full refund.')) return
    try {
      await api.cancel(id)
      setTick((t) => t + 1)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      <h1>My bookings{user ? ` – ${user.name}` : ''}</h1>

      {justBooked && (
        <div className="notice">
          Payment received and booking confirmed. Reference <strong>{justBooked.paymentRef}</strong>.
        </div>
      )}
      {error && <p className="error">{error}</p>}
      {bookings.length === 0 && !error && <p className="muted">No bookings yet.</p>}

      {bookings.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Listing</th><th>Dates</th><th>Guests</th><th>Total</th>
                  <th>Payment</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{listings[b.listingId]?.title ?? `#${b.listingId}`}</td>
                  <td>{fmtDate(b.checkIn)} → {fmtDate(b.checkOut)}</td>
                  <td>{b.guests}</td>
                  <td>{money(b.totalPrice)}</td>
                  <td>
                    {b.paymentStatus === 'REFUNDED' ? 'Refunded' : `Paid · ${methodLabel(b.paymentMethod)}`}
                    {b.paymentRef && <div className="small muted">{b.paymentRef}</div>}
                  </td>
                  <td><span className={`badge ${b.status.toLowerCase()}`}>{statusLabel(b.status)}</span></td>
                  <td>{b.canCancel && <button onClick={() => cancel(b.id)}>Cancel</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}