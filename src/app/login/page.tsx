'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  const handleGoogle = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 30% 50%, #1a0a3a 0%, #0a0a0f 60%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{
        position: 'fixed', top: '10%', left: '20%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(124,92,252,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        background: 'rgba(15, 15, 26, 0.8)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(124,92,252,0.2)', borderRadius: 20,
        padding: '48px 40px', width: '100%', maxWidth: 440,
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56,
            background: 'linear-gradient(135deg, #7c5cfc, #5a3fd4)',
            borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 0 30px rgba(124,92,252,0.4)',
          }}>
            <span style={{ fontSize: 24 }}>⚡</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Secure access to your kinetic wallet.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.08em', color: 'var(--text-secondary)',
              marginBottom: 8, textTransform: 'uppercase',
            }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>✉</span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com" required
                style={{
                  width: '100%', padding: '14px 14px 14px 42px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-bright)',
                  borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-bright)'}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
                color: 'var(--text-secondary)', textTransform: 'uppercase',
              }}>Password</label>
              <a href="#" style={{ fontSize: 12, color: 'var(--accent)' }}>Forgot password?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔒</span>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                style={{
                  width: '100%', padding: '14px 14px 14px 42px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-bright)',
                  borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-bright)'}
              />
            </div>
          </div>

          {error && (
            <p style={{ color: 'var(--error)', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>{error}</p>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '15px',
            background: loading ? 'var(--accent-dim)' : 'linear-gradient(135deg, #9b79ff, #7c5cfc)',
            border: 'none', borderRadius: 10, color: '#fff',
            fontSize: 15, fontWeight: 600, marginBottom: 20,
            boxShadow: '0 0 20px rgba(124,92,252,0.3)',
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: 12, letterSpacing: '0.05em' }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <button type="button" onClick={handleGoogle} style={{
            width: '100%', padding: '13px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-bright)',
            borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <span style={{
              width: 20, height: 20, background: '#fff', borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#4285f4',
            }}>G</span>
            Google
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)', fontSize: 13 }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: 'var(--accent)', fontWeight: 500 }}>Start free trial</Link>
        </p>
      </div>

      <div style={{ marginTop: 32, display: 'flex', gap: 32, color: 'var(--text-muted)', fontSize: 11, letterSpacing: '0.08em' }}>
        <span>FLUXPAY KINETIC ENGINE</span>
        <span>PRIVACY</span>
        <span>TERMS</span>
      </div>
    </div>
  )
}