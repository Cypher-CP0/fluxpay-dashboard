'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', agreed: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (!form.agreed) { setError('Please agree to the terms'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }

    setLoading(true)
    setError('')

    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name } },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            payout_wallet: '',
            supabase_user_id: data.user.id,
          }),
        })
        if (!res.ok) throw new Error('Failed to create merchant account')
      } catch (err) {
        console.error('Merchant creation error:', err)
      }
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 70% 50%, #0d0a2a 0%, #0a0a0f 60%)',
      display: 'flex', flexDirection: 'column',
    }}>
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>FluxPay Kinetic</div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <a href="#" style={{ color: 'var(--text-secondary)', fontSize: 14 }}>About</a>
          <a href="#" style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Security</a>
          <Link href="/login">
            <button style={{
              padding: '8px 20px', background: 'none',
              border: '1px solid var(--border-bright)', borderRadius: 8,
              color: 'var(--text-primary)', fontSize: 14,
            }}>Log In</button>
          </Link>
        </div>
      </nav>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '40px 24px',
      }}>
        <div style={{
          background: 'rgba(15, 15, 26, 0.7)', backdropFilter: 'blur(20px)',
          border: '1px solid var(--border)', borderRadius: 20,
          padding: '48px 40px', width: '100%', maxWidth: 480,
        }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 32, fontSize: 14 }}>
            Join the next generation of kinetic finance.
          </p>

          <form onSubmit={handleRegister}>
            {[
              { label: 'Full Name', type: 'text', key: 'name', placeholder: 'John Doe' },
              { label: 'Email Address', type: 'email', key: 'email', placeholder: 'name@example.com' },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  {field.label}
                </label>
                <input type={field.type} placeholder={field.placeholder} required
                  value={(form as any)[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  style={{
                    width: '100%', padding: '13px 14px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-bright)',
                    borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-bright)'}
                />
              </div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {[
                { label: 'Password', key: 'password' },
                { label: 'Confirm Password', key: 'confirm' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    {field.label}
                  </label>
                  <input type="password" placeholder="••••••••" required
                    value={(form as any)[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    style={{
                      width: '100%', padding: '13px 14px',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-bright)',
                      borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-bright)'}
                  />
                </div>
              ))}
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.agreed}
                onChange={e => setForm({ ...form, agreed: e.target.checked })}
                style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
              />
              <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                I agree to the <a href="#" style={{ color: 'var(--accent)' }}>Terms of Service</a> and{' '}
                <a href="#" style={{ color: 'var(--accent)' }}>Privacy Policy</a>.
              </span>
            </label>

            {error && (
              <p style={{ color: 'var(--error)', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>{error}</p>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '15px',
              background: 'linear-gradient(135deg, #7c5cfc, #5a3fd4)',
              border: 'none', borderRadius: 10, color: '#fff',
              fontSize: 15, fontWeight: 600, marginBottom: 20,
              boxShadow: '0 0 20px rgba(124,92,252,0.3)',
            }}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>Login</Link>
          </p>
        </div>

        <div style={{ display: 'flex', gap: 48, marginTop: 40, color: 'var(--text-muted)', fontSize: 11, letterSpacing: '0.1em' }}>
          {['🛡 BANK-GRADE', '⚡ INSTANT FLUX', '🔒 E2E ENCRYPTED'].map(b => (
            <div key={b} style={{ textAlign: 'center' }}>{b}</div>
          ))}
        </div>
      </div>

      <footer style={{ padding: '24px 40px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>FluxPay Kinetic</div>
        <div style={{ display: 'flex', gap: 24, color: 'var(--text-muted)', fontSize: 12 }}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Security</a>
        </div>
      </footer>
    </div>
  )
}