export const digits = (s) => s.replace(/\D/g, '')

// accepts 9876543210 or +91 98765 43210
export const normPhone = (s) => {
  const d = digits(s)
  return d.length === 12 && d.startsWith('91') ? d.slice(2) : d
}
export const isValidPhone = (s) => /^[6-9]\d{9}$/.test(normPhone(s))
export const isValidUpi = (s) => /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/.test(s.trim())

// Luhn checksum: catches typos in card numbers
export function luhnOk(num) {
  const d = digits(num)
  if (d.length < 13 || d.length > 19) return false
  let sum = 0
  let alt = false
  for (let i = d.length - 1; i >= 0; i--) {
    let n = Number(d[i])
    if (alt) { n *= 2; if (n > 9) n -= 9 }
    sum += n
    alt = !alt
  }
  return sum % 10 === 0
}

export function expiryOk(v) {
  const m = /^(\d{2})\/(\d{2})$/.exec(v.trim())
  if (!m) return false
  const month = Number(m[1])
  const year = 2000 + Number(m[2])
  if (month < 1 || month > 12) return false
  return new Date(year, month, 0, 23, 59, 59) >= new Date()
}