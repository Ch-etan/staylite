import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { gradient, money } from '../format'

export default function Listings() {
  const [city, setCity] = useState('')
  const [guests, setGuests] = useState('')
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // small delay so we don't call the API on every keystroke
    const timer = setTimeout(() => {
      api.listings({ city, guests })
        .then((data) => { setItems(data); setError('') })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false))
    }, 250)
    return () => clearTimeout(timer)
  }, [city, guests])

  return (
    <>
      <h1>Find your stay</h1>
      <div className="filters">
        <input placeholder="Search by city" value={city} onChange={(e) => setCity(e.target.value)} />
        <input type="number" min="1" placeholder="Guests" value={guests}
               onChange={(e) => setGuests(e.target.value)} />
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading…</p>}
      {!loading && !error && items.length === 0 && <p className="muted">No listings match.</p>}

      <div className="grid">
        {items.map((l) => (
          <Link key={l.id} to={`/listings/${l.id}`} className="card">
            <div className="thumb" style={{ background: gradient(l.id) }}>{l.city}</div>
            <div className="card-body">
              <h3>{l.title}</h3>
              <p className="muted">{l.city} · up to {l.maxGuests} guests</p>
              <p><strong>{money(l.pricePerNight)}</strong> / night</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}