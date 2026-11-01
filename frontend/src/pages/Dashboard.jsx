import { useEffect, useState } from 'react'
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { api } from '../api'
import { fmtDate, methodLabel, money, statusLabel, whenLabel } from '../format'
import { useAuth } from '../AuthContext.jsx'

const TABS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'current', label: 'Staying now' },
  { key: 'past', label: 'Past' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'all', label: 'All' },
]

const EMPTY = {
  upcoming: 'No upcoming bookings.',
  current: 'No guests are staying right now.',
  past: 'No completed stays yet.',
  cancelled: 'No cancelled bookings.',
  all: 'No bookings yet.',
}

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [when, setWhen] = useState('upcoming')
  const [result, setResult] = useState(null)      // { when, rows } for the chosen tab
  const [rowsError, setRowsError] = useState('')
  const isHost = user?.role === 'HOST'

  useEffect(() => {
    if (!isHost) return
    Promise.all([
      api.summary(), api.monthly(), api.topListings(), api.occupancy(),
    ])
      .then(([summary, monthly, top, occupancy]) => {
        setData({ summary, monthly, top, occupancy })
        setError('')
      })
      .catch((e) => setError(e.message))
  }, [isHost])

  // reload the booking list whenever the tab changes
  useEffect(() => {
    if (!isHost) return
    let ignore = false
    api.hostBookings(when)
      .then((rows) => {
        if (!ignore) { setResult({ when, rows }); setRowsError('') }
      })
      .catch((e) => { if (!ignore) setRowsError(e.message) })
    return () => { ignore = true }
  }, [isHost, when])

  if (!user) return <p className="muted">Loading…</p>
  if (!isHost) return <p>The dashboard is for hosts. Log in with a host account.</p>
  if (error) return <p className="error">{error}</p>
  if (!data) return <p className="muted">Loading dashboard…</p>

  const { summary, monthly, top, occupancy } = data
  const rows = result?.when === when ? result.rows : null
  const rowsTotal = rows ? rows.reduce((sum, r) => sum + Number(r.totalPrice), 0) : 0

  function showUpcoming() {
    setWhen('upcoming')
    document.getElementById('host-bookings')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <h1>Host dashboard</h1>

      <div className="stats">
        <div className="stat"><span>Total revenue</span><strong>{money(summary.revenue)}</strong></div>
        <div className="stat"><span>Confirmed bookings</span><strong>{summary.confirmedBookings}</strong></div>
        <button type="button" className="stat clickable" onClick={showUpcoming}>
          <span>Upcoming check-ins</span>
          <strong>{summary.upcomingBookings}</strong>
          <em>View guest details ↓</em>
        </button>
        <div className="stat"><span>Cancelled</span><strong>{summary.cancelledBookings}</strong></div>
        <div className="stat"><span>Listings</span><strong>{summary.listings}</strong></div>
      </div>

      <section id="host-bookings" className="panel bookings-panel">
        <div className="section-head">
          <h3>Guest bookings</h3>
          <div className="seg">
            {TABS.map((t) => (
              <button key={t.key} type="button"
                      className={when === t.key ? 'active' : ''}
                      onClick={() => setWhen(t.key)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {rowsError && <p className="error">{rowsError}</p>}
        {!rows && !rowsError && <p className="muted">Loading bookings…</p>}
        {rows && rows.length === 0 && <p className="muted">{EMPTY[when]}</p>}

        {rows && rows.length > 0 && (
          <>
            <p className="muted result-count">
              {rows.length} booking{rows.length === 1 ? '' : 's'}
              {when !== 'cancelled' && ` · ${money(rowsTotal)}`}
            </p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Guest</th><th>Staying at</th><th>Check-in</th><th>Check-out</th>
                    <th>Nights</th><th>Guests</th><th>Total</th><th>Payment</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <strong>{r.guestName}</strong>
                        <div className="small"><a href={`mailto:${r.guestEmail}`}>{r.guestEmail}</a></div>
                        {r.guestPhone && <div className="small">{r.guestPhone}</div>}
                        {r.specialRequests && <div className="small hint">“{r.specialRequests}”</div>}
                      </td>
                      <td>
                        <strong>{r.listingTitle}</strong>
                        <div className="small muted">{r.city}</div>
                      </td>
                      <td>
                        {fmtDate(r.checkIn)}
                        {when === 'upcoming' && <div className="small hint">{whenLabel(r.checkIn)}</div>}
                      </td>
                      <td>
                        {fmtDate(r.checkOut)}
                        {when === 'current' && <div className="small hint">Leaves {whenLabel(r.checkOut).toLowerCase()}</div>}
                      </td>
                      <td>{r.nights}</td>
                      <td>{r.guests}</td>
                      <td>{money(r.totalPrice)}</td>
                      <td>{r.paymentStatus === 'REFUNDED' ? 'Refunded' : `Paid · ${methodLabel(r.paymentMethod)}`}</td>
                      <td><span className={`badge ${r.status.toLowerCase()}`}>{statusLabel(r.status)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <div className="charts">
        <div className="panel">
          <h3>Bookings per month</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#e0245e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <h3>Revenue per month</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(v) => money(v)} />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts">
        <div className="panel">
          <h3>Occupancy, next 30 nights</h3>
          {occupancy.map((o) => (
            <div key={o.listingId} className="occ">
              <div className="occ-label">
                <span>{o.title}</span><span>{o.occupancyPercent}%</span>
              </div>
              <div className="bar"><div style={{ width: `${o.occupancyPercent}%` }} /></div>
            </div>
          ))}
        </div>

        <div className="panel">
          <h3>Top listings by revenue</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Listing</th><th>Bookings</th><th>Revenue</th></tr></thead>
              <tbody>
                {top.map((t) => (
                  <tr key={t.listingId}>
                    <td>{t.title}</td><td>{t.bookings}</td><td>{money(t.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}