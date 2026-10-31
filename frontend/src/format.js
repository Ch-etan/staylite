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