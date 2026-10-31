import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'
import Listings from './pages/Listings.jsx'
import ListingDetail from './pages/ListingDetail.jsx'
import MyBookings from './pages/MyBookings.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'

function RequireAuth({ role, children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <p className="muted">Loading…</p>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (role && user.role !== role) return <p>This page is only for {role.toLowerCase()}s.</p>
  return children
}

export default function App() {
  const { user, logout } = useAuth()

  return (
    <>
      <header className="nav">
        <NavLink to="/" className="brand">StayLite</NavLink>
        <nav>
          <NavLink to="/" end>Explore</NavLink>
          {user && <NavLink to="/bookings">My bookings</NavLink>}
          {user?.role === 'HOST' && <NavLink to="/dashboard">Dashboard</NavLink>}
        </nav>
        <div className="who">
          {user ? (
            <>
              <span>{user.name} <span className="badge role">{user.role}</span></span>
              <button onClick={logout}>Log out</button>
            </>
          ) : (
            <NavLink to="/login">Log in</NavLink>
          )}
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bookings" element={<RequireAuth><MyBookings /></RequireAuth>} />
          <Route path="/dashboard" element={<RequireAuth role="HOST"><Dashboard /></RequireAuth>} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </>
  )
}