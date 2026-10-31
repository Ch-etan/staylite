import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { CATEGORIES, amenityList, categoryLabel, money } from '../format'
import Scene from '../Scene.jsx'

const SORTS = [
  { value: '', label: 'Recommended' },
  { value: 'rating', label: 'Top rated' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
]

export default function Listings() {
  const [city, setCity] = useState('')
  const [guests, setGuests] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('')
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // small delay so we don't call the API on every keystroke
    const timer = setTimeout(() => {
      api.listings({ city, guests, category, sort })
        .then((data) => { setItems(data); setError('') })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false))
    }, 250)
    return () => clearTimeout(timer)
  }, [city, guests, category, sort])

  return (
    <>
      <section className="hero-banner">
        <h1>Find your next stay in India</h1>
        <p>Beaches, mountains, lakes, deserts and heritage homes, all in one place.</p>
        <div className="search">
          <input placeholder="Where to? Try Goa, Jaipur, Munnar…" value={city}
                 onChange={(e) => setCity(e.target.value)} aria-label="City" />
          <input type="number" min="1" placeholder="Guests" value={guests}
                 onChange={(e) => setGuests(e.target.value)} aria-label="Guests" />
        </div>
      </section>

      <div className="toolbar">
        <div className="chips">
          {CATEGORIES.map((c) => (
            <button key={c.key} type="button"
                    className={`chip${category === c.key ? ' active' : ''}`}
                    onClick={() => setCategory(c.key)}>
              <span>{c.icon}</span> {c.label}
            </button>
          ))}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <p className="muted result-count">
          {items.length} place{items.length === 1 ? '' : 's'} found
        </p>
      )}
      {!loading && !error && items.length === 0 && (
        <div className="empty panel">
          <h3>No stays match your search</h3>
          <p className="muted">Try another city, fewer guests, or a different category.</p>
        </div>
      )}

      <div className="grid">
        {loading && Array.from({ length: 6 }, (_, i) => <div key={i} className="skeleton" />)}
        {!loading && items.map((l) => (
          <Link key={l.id} to={`/listings/${l.id}`} className="card">
            <div className="thumb">
              <Scene category={l.category} seed={l.id} />
              <span className="tag">{categoryLabel(l.category)}</span>
              <span className="rating">★ {Number(l.rating).toFixed(1)}</span>
            </div>
            <div className="card-body">
              <h3>{l.title}</h3>
              <p className="muted">{l.city} · up to {l.maxGuests} guests</p>
              <p className="amen">{amenityList(l.amenities).slice(0, 3).join(' · ')}</p>
              <p className="price"><strong>{money(l.pricePerNight)}</strong> <span className="muted">/ night</span></p>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}