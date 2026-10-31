export const money = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)

export const gradient = (id) =>
  `linear-gradient(135deg, hsl(${(id * 67) % 360} 70% 60%), hsl(${(id * 67 + 40) % 360} 70% 45%))`