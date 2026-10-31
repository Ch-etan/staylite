import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import { AMENITY_ICONS, amenityList, categoryLabel, money } from '../format'
import { useAuth } from '../AuthContext.jsx'
import Scene from '../Scene.jsx'

const todayLocal = () =>
  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [listing, setListing] = useState(null)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [available, setAvailable] = useState(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const nights = checkIn && checkOut
    ? Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000)
    : 0

  useEffect(() => {
    api.listing(id).then(setListing).catch((e) => setMessage(e.message))
  }, [id])

  // check availability whenever the dates change
  useEffect(() => {
    setAvailable(null)
    setMessage('')
    if (!checkIn || !checkOut || nights <= 0) return
    api.availability(id, checkIn, checkOut)
      .then((r) => setAvailable(r.available))
      .catch((e) => setMessage(e.message))
  }, [id, checkIn, checkOut, nights])

  async function book() {
    setBusy(true)
    setMessage('')
    try {
      await api.book({
        listingId: Number(id),
        checkIn,
        checkOut,
        guests: Number(guests),
      })
      navigate('/bookings')
    } catch (e) {
      setMessage(e.message)
      setAvailable(null)
    } finally {
      setBusy(false)
    }
  }

  if (!listing) return <p className="muted">{message || 'Loading…'}</p>

  return (
    <div className="detail">
      <Link to="/" className="back">← All stays</Link>

      <div className="detail-hero">
        <Scene category={listing.category} seed={listing.id} />
        <span className="tag">{categoryLabel(listing.category)}</span>
      </div>

      <div className="detail-grid">
        <div>
          <h1>{listing.title}</h1>
          <p className="meta">
            <span className="rating-inline">★ {Number(listing.rating).toFixed(1)}</span>
            <span>{listing.city}</span>
            <span>Up to {listing.maxGuests} guests</span>
          </p>
          <p className="description">{listing.description}</p>

          <h3>What this place offers</h3>
          <div className="amenities">
            {amenityList(listing.amenities).map((a) => (
              <div key={a} className="amenity">
                <span>{AMENITY_ICONS[a] ?? '✔'}</span> {a}
              </div>
            ))}
          </div>
        </div>

        <div className="panel booking">
          <p className="booking-price"><strong>{money(listing.pricePerNight)}</strong> <span className="muted">/ night</span></p>
          <label>Check-in
            <input type="date" min={todayLocal()} value={checkIn}
                   onChange={(e) => setCheckIn(e.target.value)} />
          </label>
          <label>Check-out
            <input type="date" min={checkIn || todayLocal()} value={checkOut}
                   onChange={(e) => setCheckOut(e.target.value)} />
          </label>
          <label>Guests
            <input type="number" min="1" max={listing.maxGuests} value={guests}
                   onChange={(e) => setGuests(e.target.value)} />
          </label>

          {nights > 0 && (
            <p className="total">{nights} night{nights > 1 ? 's' : ''} × {money(listing.pricePerNight)} ={' '}
              <strong>{money(nights * listing.pricePerNight)}</strong></p>
          )}
          {available === true && <p className="ok">Available for these dates</p>}
          {available === false && <p className="error">Already booked for these dates</p>}
          {message && <p className="error">{message}</p>}

          {user ? (
            <button className="primary" onClick={book}
                    disabled={busy || nights <= 0 || available !== true}>
              {busy ? 'Booking…' : `Book as ${user.name}`}
            </button>
          ) : (
            <Link className="button primary" to="/login" state={{ from: location.pathname }}>
              Log in to book
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}