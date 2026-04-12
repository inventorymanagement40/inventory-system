import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <h1>Page Not Found</h1>
        <p className="subtle-text">The requested route does not exist.</p>
        <Link className="btn btn-primary" to="/">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
