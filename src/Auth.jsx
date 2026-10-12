import { useState } from 'react'
import { api } from './api.js'

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    if (busy) return
    setBusy(true); setErr('')
    try {
      const r = await api(`/api/auth/${mode}`, { method: 'POST', body: { email, password: pw } })
      onAuth({ token: r.token, email: r.email })
    } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }

  return (
    <main style={{ maxWidth: 460, paddingTop: 60 }}>
      <h2>Lock-in</h2>
      <p className="sub">{mode === 'login' ? 'Log in to see your habits.' : 'Create an account to save your habits.'}</p>
      <form className="card" onSubmit={e => { e.preventDefault(); submit() }}>
        <div className="g2" style={{ gridTemplateColumns: '1fr' }}>
          <label>Email<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required
            style={{ font: 'inherit', padding: '7px 10px', border: '1.5px solid var(--edge)', borderRadius: 9, width: '100%' }} /></label>
          <label>Password<input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            value={pw} onChange={e => setPw(e.target.value)} required minLength={8}
            style={{ font: 'inherit', padding: '7px 10px', border: '1.5px solid var(--edge)', borderRadius: 9, width: '100%' }} /></label>
        </div>
        <button className="btn pri" style={{ marginTop: 12 }} disabled={busy}>
          {busy ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>
        {err && <div className="err">{err}</div>}
        <p className="sub" style={{ marginTop: 12, marginBottom: 0 }}>
          {mode === 'login' ? 'New here? ' : 'Already have an account? '}
          <button type="button" className="btn" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErr('') }}>
            {mode === 'login' ? 'Create account' : 'Log in'}
          </button>
        </p>
      </form>
    </main>
  )
}