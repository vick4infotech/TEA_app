'use client';
import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        cache: 'no-store',
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        window.location.assign('/dashboard');
        return;
      }

      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Invalid sign-in details or inactive account.');
    } catch {
      setError('Unable to complete sign-in. Check the server and try again.');
    } finally {
      setLoading(false);
    }
  }

  return <form onSubmit={submit} className="card mx-auto max-w-md">
    <h2 className="text-2xl font-bold text-teaPurple-900">Administrator Login</h2>
    <p className="mt-1 text-sm text-gray-600">Approved administrators and coordinators only.</p>
    {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    <label className="mt-6 block text-sm font-semibold">Email</label>
    <input className="input mt-2" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
    <label className="mt-4 block text-sm font-semibold">Password</label>
    <input className="input mt-2" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
    <button className="btn-primary mt-6 w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
    <a className="mt-4 block text-center text-sm font-semibold text-teaPurple-700" href="/result-checker">Check Result</a>
  </form>;
}
