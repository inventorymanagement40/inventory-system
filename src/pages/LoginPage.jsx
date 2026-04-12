import { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function LoginPage() {
  const { login, role, user, loading } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const notice = location.state?.notice ?? ''

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(email, password)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!loading && user && role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />
  }

  if (!loading && user && role === 'staff') {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="auth-wrapper">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Inventory Login</h1>
        <p className="subtle-text">Sign in with your account.</p>
        {notice && <p className="success-text">{notice}</p>}
        <input
          className="input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
        />
        <div className="input-with-action">
          <input
            className="input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            required
          />
          <button
            className="input-action-btn"
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FiEyeOff size={18} aria-hidden="true" /> : <FiEye size={18} aria-hidden="true" />}
          </button>
        </div>
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Login'}
        </button>
        {error && <p className="error-text">{error}</p>}
        <p className="subtle-text">
          New user? <Link className="auth-link" to="/signup">Create account</Link>
        </p>
      </form>
    </div>
  )
}
