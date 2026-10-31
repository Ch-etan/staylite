import { NavLink, Route, Routes } from 'react-router-dom'
import { useUser } from './UserContext.jsx'
import Listings from './pages/Listings.jsx'
import ListingDetail from './pages/ListingDetail.jsx'
import MyBookings from './pages/MyBookings.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  const { users, user, userId, setUserId } = useUser()

  return (
    <>
      <header className="nav">
        <NavLink to="/" className="brand">StayLite</NavLink>
        <nav>
          <NavLink to="/" end>Explore</NavLink>
          <NavLink to="/bookings">My bookings</NavLink>
          {user?.role === 'HOST' && <NavLink to="/dashboard">Dashboard</NavLink>}
        </nav>
        <label className="switcher">
          Signed in as
          <select value={userId} onChange={(e) => setUserId(Number(e.target.value))}>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </select>
        </label>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </>
  )
}