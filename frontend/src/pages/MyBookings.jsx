import { useEffect, useState } from 'react'
import { api } from '../api'
import { money } from '../format'
import { useAuth } from '../AuthContext.jsx'

export default function MyBookings() {
  const { user } = useAuth()
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
      {error && <p className="error">{error}</p>}
      {bookings.length === 0 && !error && <p className="muted">No bookings yet.</p>}

      {bookings.length > 0 && (
        <table>
          <thead>
            <tr><th>Listing</th><th>Check-in</th><th>Check-out</th><th>Guests</th>
                <th>Total</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{listings[b.listingId]?.title ?? `#${b.listingId}`}</td>
                <td>{b.checkIn}</td>
                <td>{b.checkOut}</td>
                <td>{b.guests}</td>
                <td>{money(b.totalPrice)}</td>
                <td><span className={`badge ${b.status.toLowerCase()}`}>{b.status}</span></td>
                <td>
                  {b.status === 'CONFIRMED' && (
                    <button onClick={() => cancel(b.id)}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}