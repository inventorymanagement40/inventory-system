import { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function SignupPage() {
  const { signup, logout, role, user, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      const result = await signup(email, password)

      if (result.session) {
        await logout()
      }

      const notice = result.session
        ? 'Account created successfully. Please login to continue.'
        : 'Account created. Confirm your email first, then login.'

      navigate('/login', { replace: true, state: { notice } })
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
        <h1>Create Account</h1>
        <p className="subtle-text">Register a new staff account.</p>
        <p className="subtle-text">After account creation, you will continue from the login page.</p>
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
            minLength={6}
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
        <div className="input-with-action">
          <input
            className="input"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm Password"
            minLength={6}
            required
          />
          <button
            className="input-action-btn"
            type="button"
            onClick={() => setShowConfirmPassword((current) => !current)}
            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
          >
            {showConfirmPassword ? (
              <FiEyeOff size={18} aria-hidden="true" />
            ) : (
              <FiEye size={18} aria-hidden="true" />
            )}
          </button>
        </div>
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Sign Up'}
        </button>
        {error && <p className="error-text">{error}</p>}
        <p className="subtle-text">
          Already have an account? <Link className="auth-link" to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}
