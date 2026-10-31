import { useEffect, useState } from 'react'
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { api } from '../api'
import { money } from '../format'
import { useUser } from '../UserContext.jsx'

export default function Dashboard() {
  const { user, userId } = useUser()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const isHost = user?.role === 'HOST'

  useEffect(() => {
    if (!isHost) return
    Promise.all([
      api.summary(userId), api.monthly(userId), api.topListings(userId), api.occupancy(userId),
    ])
      .then(([summary, monthly, top, occupancy]) => {
        setData({ summary, monthly, top, occupancy })
        setError('')
      })
      .catch((e) => setError(e.message))
  }, [isHost, userId])

  if (!user) return <p className="muted">Loading…</p>
  if (!isHost) return <p>The dashboard is for hosts. Switch to a host in the top-right menu.</p>
  if (error) return <p className="error">{error}</p>
  if (!data) return <p className="muted">Loading dashboard…</p>

  const { summary, monthly, top, occupancy } = data

  return (
    <>
      <h1>Host dashboard</h1>

      <div className="stats">
        <div className="stat"><span>Total revenue</span><strong>{money(summary.revenue)}</strong></div>
        <div className="stat"><span>Confirmed bookings</span><strong>{summary.confirmedBookings}</strong></div>
        <div className="stat"><span>Upcoming check-ins</span><strong>{summary.upcomingBookings}</strong></div>
        <div className="stat"><span>Cancelled</span><strong>{summary.cancelledBookings}</strong></div>
        <div className="stat"><span>Listings</span><strong>{summary.listings}</strong></div>
      </div>

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
    </>
  )
}