const TOKEN_KEY = 'token'

async function request(path, options = {}, withAuth = false) {
  const headers = { 'Content-Type': 'application/json' }
  const token = localStorage.getItem(TOKEN_KEY)
  if (withAuth && token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(path, { ...options, headers })

  if (res.status === 401 && withAuth && token) {
    window.dispatchEvent(new Event('auth:logout'))
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    if (res.status === 401) message = 'Please log in again'
    if (res.status === 403) message = 'You do not have access to this'
    try {
      const body = await res.json()
      if (body.detail) message = body.detail
    } catch {
      // response had no JSON body
    }
    throw new Error(message)
  }
  return res.json()
}

const authed = (path, options) => request(path, options, true)

export const api = {
  // auth
  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name, email, password) =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  me: () => authed('/api/auth/me'),

  // public
  listings: (params = {}) => {
    const clean = Object.entries(params).filter(([, v]) => v !== '' && v != null)
    return request(`/api/listings?${new URLSearchParams(clean)}`)
  },
  listing: (id) => request(`/api/listings/${id}`),
  availability: (listingId, checkIn, checkOut) =>
    request(`/api/bookings/availability?listingId=${listingId}&checkIn=${checkIn}&checkOut=${checkOut}`),

  // needs login
  book: (body) => authed('/api/bookings', { method: 'POST', body: JSON.stringify(body) }),
  myBookings: () => authed('/api/bookings'),
  cancel: (id) => authed(`/api/bookings/${id}/cancel`, { method: 'POST' }),

  // needs the HOST role
  summary: () => authed('/api/dashboard/summary'),
  monthly: () => authed('/api/dashboard/monthly'),
  topListings: () => authed('/api/dashboard/top-listings'),
  occupancy: () => authed('/api/dashboard/occupancy'),
}