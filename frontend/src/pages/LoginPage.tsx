import { Link } from "react-router-dom";

export function LoginPage() {
  return (
    <main className="page-shell auth-shell">
      <section className="page-card compact-card">
        <p className="eyebrow">NeuroGuard</p>
        <h1>Login</h1>
        <p className="page-copy">
          Placeholder login route. The authentication form can be added here.
        </p>
        <div className="link-row">
          <Link className="primary-link" to="/dashboard">
            Continue to dashboard
          </Link>
          <Link className="ghost-link" to="/signup">
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}
