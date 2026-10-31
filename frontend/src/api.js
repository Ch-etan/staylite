async function request(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    let message = `Request failed (${res.status})`
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

export const api = {
  users: () => request('/api/users'),

  listings: (params = {}) => {
    const clean = Object.entries(params).filter(([, v]) => v !== '' && v != null)
    return request(`/api/listings?${new URLSearchParams(clean)}`)
  },
  listing: (id) => request(`/api/listings/${id}`),

  availability: (listingId, checkIn, checkOut) =>
    request(`/api/bookings/availability?listingId=${listingId}&checkIn=${checkIn}&checkOut=${checkOut}`),
  book: (body) => request('/api/bookings', { method: 'POST', body: JSON.stringify(body) }),
  myBookings: (guestId) => request(`/api/bookings?guestId=${guestId}`),
  cancel: (id) => request(`/api/bookings/${id}/cancel`, { method: 'POST' }),

  summary: (hostId) => request(`/api/dashboard/summary?hostId=${hostId}`),
  monthly: (hostId) => request(`/api/dashboard/monthly?hostId=${hostId}`),
  topListings: (hostId) => request(`/api/dashboard/top-listings?hostId=${hostId}`),
  occupancy: (hostId) => request(`/api/dashboard/occupancy?hostId=${hostId}`),
}