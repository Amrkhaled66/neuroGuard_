import { Link } from 'react-router-dom'

export function SignupPage() {
  return (
    <main className="page-shell auth-shell">
      <section className="page-card compact-card">
        <p className="eyebrow">NeuroGuard</p>
        <h1>Sign Up</h1>
        <p className="page-copy">
          Placeholder signup route. Account creation fields can be added here.
        </p>
        <div className="link-row">
          <Link className="primary-link" to="/login">
            Back to login
          </Link>
        </div>
      </section>
    </main>
  )
}
