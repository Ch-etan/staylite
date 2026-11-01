export const money = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)

export const CATEGORIES = [
  { key: '', label: 'All', icon: '✨' },
  { key: 'beach', label: 'Beach', icon: '🏖️' },
  { key: 'mountain', label: 'Mountain', icon: '🏔️' },
  { key: 'city', label: 'City', icon: '🏙️' },
  { key: 'lake', label: 'Lake & water', icon: '🛶' },
  { key: 'desert', label: 'Desert', icon: '🏜️' },
  { key: 'forest', label: 'Forest & estates', icon: '🌿' },
  { key: 'heritage', label: 'Heritage', icon: '🏰' },
]

export const categoryLabel = (key) =>
  CATEGORIES.find((c) => c.key === key)?.label ?? key

export const amenityList = (text) =>
  text ? text.split(',').map((a) => a.trim()).filter(Boolean) : []

export const AMENITY_ICONS = {
  'WiFi': '📶',
  'Air conditioning': '❄️',
  'Kitchen': '🍳',
  'Beach access': '🏖️',
  'Fireplace': '🔥',
  'Mountain view': '🏔️',
  'Parking': '🅿️',
  'Hot water': '🚿',
  'Balcony': '🌇',
  'Breakfast included': '🥐',
  'Lake view': '🌅',
  'Bonfire': '🪵',
  'Garden': '🌿',
  'Yoga deck': '🧘',
  'Pool': '🏊',
  'Sea view': '🌊',
}
// "12 Dec 2026"
export const fmtDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

const daysUntil = (iso) => {
  const d = new Date(`${iso}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((d - today) / 86400000)
}

// "Today", "Tomorrow", "in 5 days", "3 days ago"
export const whenLabel = (iso) => {
  const n = daysUntil(iso)
  if (n === 0) return 'Today'
  if (n === 1) return 'Tomorrow'
  if (n > 1) return `in ${n} days`
  return `${-n} day${n === -1 ? '' : 's'} ago`
}

export const STATUS_LABELS = {
  UPCOMING: 'Upcoming',
  IN_PROGRESS: 'Staying now',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}
export const statusLabel = (s) => STATUS_LABELS[s] ?? s

export const METHOD_LABELS = { UPI: 'UPI', CARD: 'Card', NETBANKING: 'Net banking' }
export const methodLabel = (m) => METHOD_LABELS[m] ?? m