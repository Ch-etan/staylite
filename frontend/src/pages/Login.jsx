import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

const DEMO_PASSWORD = 'demo1234'

export default function Login() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  function fillDemo(email) {
    setMode('login')
    setForm({ name: '', email, password: DEMO_PASSWORD })
  }

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (mode === 'login') await login(form.email, form.password)
      else await register(form.name, form.email, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-card panel">
      <div className="tabs">
        <button type="button" className={mode === 'login' ? 'active' : ''}
                onClick={() => setMode('login')}>Log in</button>
        <button type="button" className={mode === 'register' ? 'active' : ''}
                onClick={() => setMode('register')}>Sign up</button>
      </div>

      <form onSubmit={submit}>
        {mode === 'register' && (
          <label>Name
            <input value={form.name} onChange={set('name')} required maxLength={100} />
          </label>
        )}
        <label>Email
          <input type="email" value={form.email} onChange={set('email')} required />
        </label>
        <label>Password {mode === 'register' && <span className="muted">(min 8 characters)</span>}
          <input type="password" value={form.password} onChange={set('password')}
                 required minLength={mode === 'register' ? 8 : 1} />
        </label>

        {error && <p className="error">{error}</p>}
        <button className="primary" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>
      </form>

      <div className="demo-row">
        <span className="muted">Demo accounts:</span>
        <button type="button" onClick={() => fillDemo('asha@staylite.com')}>Host (Asha)</button>
        <button type="button" onClick={() => fillDemo('ravi@staylite.com')}>Guest (Ravi)</button>
      </div>
    </div>
  )
}