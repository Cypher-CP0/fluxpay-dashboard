'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '▦' },
  { href: '/dashboard/transactions', label: 'Transactions', icon: '≡' },
  { href: '/dashboard/payouts', label: 'Payouts', icon: '◫' },
  { href: '/dashboard/settings', label: 'Webhooks', icon: '✦' },
  { href: '/dashboard/embed', label: 'Embed Code', icon: '</>' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'fixed', left: 0, top: 0,
    }}>
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          FluxPay
        </div>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', color: 'var(--text-muted)', marginTop: 2 }}>
          KINETIC ENGINE
        </div>
      </div>

      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 8, marginBottom: 2,
                background: active ? 'var(--accent-glow)' : 'none',
                borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: 14, fontWeight: active ? 500 : 400,
                transition: 'all 0.15s', cursor: 'pointer',
              }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </div>
            </Link>
          )
        })}
      </nav>

      <div style={{
        margin: '12px', padding: '12px 14px',
        background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
          }}>FP</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>API status</div>
            <div style={{ fontSize: 11, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
              Operational
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleSignOut} style={{
        margin: '0 12px 16px', padding: '10px 14px',
        background: 'none', border: '1px solid var(--border)',
        borderRadius: 8, color: 'var(--text-muted)',
        fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
        cursor: 'pointer', transition: 'all 0.15s',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--error)'
          e.currentTarget.style.color = 'var(--error)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.color = 'var(--text-muted)'
        }}
      >
        ⎋ Sign out
      </button>
    </aside>
  )
}