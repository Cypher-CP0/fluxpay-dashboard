'use client'
import { useEffect, useState } from 'react'
import Topbar from '@/components/Topbar'
import { useMerchant } from '@/lib/merchantContext'

interface Payment {
  id: string
  order_id: string
  deposit_address: string
  amount_usdc: string
  amount_received: string | null
  token_received: string | null
  status: string
  expires_at: string
  created_at: string
}

const statusColors: Record<string, string> = {
  completed: 'var(--success)', pending: 'var(--warning)',
  failed: 'var(--error)', swapping: 'var(--accent)',
  detected: 'var(--accent)', expired: 'var(--text-muted)',
}
const statusBg: Record<string, string> = {
  completed: 'var(--success-bg)', pending: 'var(--warning-bg)',
  failed: 'var(--error-bg)', swapping: 'var(--accent-glow)',
  detected: 'var(--accent-glow)', expired: 'rgba(255,255,255,0.05)',
}

export default function TransactionsPage() {
  const { merchant } = useMerchant()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!merchant?.api_key) return
    const fetch_ = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments`, {
          headers: { 'x-api-key': merchant.api_key },
        })
        if (!res.ok) return
        const data = await res.json()
        setPayments(data)
      } catch (err) {
        console.error('Failed to fetch payments:', err)
      } finally {
        setLoading(false)
      }
    }
    fetch_()
  }, [merchant])

  const filtered = payments
    .filter(p => filter === 'all' || p.status === filter)
    .filter(p =>
      search === '' ||
      p.order_id.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div>
      <Topbar placeholder="Search transactions..." />

      <div style={{ padding: '32px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
              Transactions
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              {loading ? 'Loading...' : `${payments.length} total payments`}
            </p>
          </div>
        </div>

        {/* Search + Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search by order ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '8px 14px', background: 'var(--bg-elevated)',
              border: '1px solid var(--border)', borderRadius: 8,
              color: 'var(--text-primary)', fontSize: 13, outline: 'none', width: 240,
            }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'completed', 'pending', 'detected', 'swapping', 'failed', 'expired'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '7px 14px', borderRadius: 8, fontSize: 12,
                  background: filter === f ? 'var(--accent-glow)' : 'var(--bg-elevated)',
                  border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
                  color: filter === f ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: filter === f ? 500 : 400,
                  textTransform: 'capitalize',
                }}
              >{f}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 16, overflow: 'hidden',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.2fr 1fr 1fr 0.8fr 1fr',
            padding: '14px 20px',
            background: 'var(--bg-elevated)',
            borderBottom: '1px solid var(--border)',
          }}>
            {['ORDER ID', 'DATE', 'AMOUNT (USDC)', 'RECEIVED', 'TOKEN', 'STATUS'].map(h => (
              <div key={h} style={{ fontSize: 11, letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 500 }}>
                {h}
              </div>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading transactions...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              {payments.length === 0 ? 'No transactions yet.' : 'No transactions match your filter.'}
            </div>
          ) : filtered.map((tx, i) => (
            <div
              key={tx.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.2fr 1fr 1fr 0.8fr 1fr',
                padding: '14px 20px', alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                transition: 'background 0.15s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-primary)', marginBottom: 2 }}>
                  {tx.order_id}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text-muted)' }}>
                  {tx.id.slice(0, 16)}...
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {new Date(tx.created_at).toLocaleDateString()}{' '}
                <span style={{ color: 'var(--text-muted)' }}>
                  {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>
                ${Number(tx.amount_usdc).toFixed(2)}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {tx.amount_received ? `${Number(tx.amount_received).toFixed(4)}` : '—'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {tx.token_received ?? '—'}
              </div>
              <div>
                <span style={{
                  padding: '4px 10px', borderRadius: 20,
                  fontSize: 11, fontWeight: 600,
                  background: statusBg[tx.status] ?? 'rgba(255,255,255,0.05)',
                  color: statusColors[tx.status] ?? 'var(--text-muted)',
                  textTransform: 'uppercase',
                }}>{tx.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}