'use client'
import { useState } from 'react'
import Topbar from '@/components/Topbar'

const TRANSACTIONS = [
  { id: '#TX-89210-ZP', customer: 'John Doe', initials: 'JD', date: 'Oct 12, 2023', amount: '$2,400.00', token: 'SOL', status: 'completed' },
  { id: '#TX-89211-KQ', customer: 'Alice Smith', initials: 'AS', date: 'Oct 12, 2023', amount: '$890.50', token: 'USDC', status: 'pending' },
  { id: '#TX-89212-LM', customer: 'Ryan Thompson', initials: 'RT', date: 'Oct 11, 2023', amount: '$45.00', token: 'SOL', status: 'failed' },
  { id: '#TX-89213-AB', customer: 'Sarah Connor', initials: 'SC', date: 'Oct 11, 2023', amount: '$1,200.00', token: 'SOL', status: 'completed' },
  { id: '#TX-89214-CD', customer: 'Mike Johnson', initials: 'MJ', date: 'Oct 10, 2023', amount: '$55.00', token: 'USDT', status: 'completed' },
  { id: '#TX-89215-EF', customer: 'Emma Wilson', initials: 'EW', date: 'Oct 10, 2023', amount: '$320.00', token: 'SOL', status: 'swapping' },
]

const statusColors: Record<string, string> = {
  completed: 'var(--success)', pending: 'var(--warning)',
  failed: 'var(--error)', swapping: 'var(--accent)',
}
const statusBg: Record<string, string> = {
  completed: 'var(--success-bg)', pending: 'var(--warning-bg)',
  failed: 'var(--error-bg)', swapping: 'var(--accent-glow)',
}

export default function TransactionsPage() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? TRANSACTIONS : TRANSACTIONS.filter(t => t.status === filter)

  return (
    <div>
      <Topbar placeholder="Search transactions..." />

      <div style={{ padding: '32px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6,
            }}>Transactions</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              All payment activity across your merchant account.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['all', 'completed', 'pending', 'swapping', 'failed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 16px', borderRadius: 8, fontSize: 13,
                background: filter === f ? 'var(--accent-glow)' : 'var(--bg-elevated)',
                border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
                color: filter === f ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: filter === f ? 500 : 400,
                textTransform: 'capitalize',
              }}
            >{f}</button>
          ))}
        </div>

        {/* Table */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 16, overflow: 'hidden',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 0.8fr 1fr 0.5fr',
            padding: '14px 20px',
            background: 'var(--bg-elevated)',
            borderBottom: '1px solid var(--border)',
          }}>
            {['TRANSACTION ID', 'CUSTOMER', 'DATE', 'AMOUNT', 'TOKEN', 'STATUS', ''].map(h => (
              <div key={h} style={{
                fontSize: 11, letterSpacing: '0.08em',
                color: 'var(--text-muted)', fontWeight: 500,
              }}>{h}</div>
            ))}
          </div>

          {filtered.map((tx, i) => (
            <div key={tx.id} style={{
              display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 0.8fr 1fr 0.5fr',
              padding: '14px 20px', alignItems: 'center',
              borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--text-primary)' }}>{tx.id}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 600,
                }}>{tx.initials}</div>
                <span style={{ fontSize: 13 }}>{tx.customer}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{tx.date}</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{tx.amount}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{tx.token}</div>
              <div>
                <span style={{
                  padding: '4px 10px', borderRadius: 20,
                  fontSize: 11, fontWeight: 600,
                  background: statusBg[tx.status],
                  color: statusColors[tx.status],
                  textTransform: 'uppercase',
                }}>{tx.status}</span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 18, cursor: 'pointer' }}>⋮</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
