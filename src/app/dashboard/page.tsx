'use client'
import { useEffect, useState } from 'react'
import Topbar from '@/components/Topbar'
import { useMerchant } from '@/lib/merchantContext'

const CHART_DATA = [120, 180, 140, 200, 240, 220, 320, 300, 380, 260, 310, 280]
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

const statusColors: Record<string, string> = {
  completed: 'var(--success)', pending: 'var(--warning)',
  failed: 'var(--error)', swapping: 'var(--accent)', detected: 'var(--accent)',
}
const statusBg: Record<string, string> = {
  completed: 'var(--success-bg)', pending: 'var(--warning-bg)',
  failed: 'var(--error-bg)', swapping: 'var(--accent-glow)', detected: 'var(--accent-glow)',
}

interface Payment {
  id: string
  order_id: string
  amount_usdc: string
  token_received: string | null
  status: string
  created_at: string
}

export default function DashboardPage() {
  const { merchant, loading } = useMerchant()
  const [payments, setPayments] = useState<Payment[]>([])
  const [paymentsLoading, setPaymentsLoading] = useState(true)
  const maxVal = Math.max(...CHART_DATA)

  useEffect(() => {
    if (!merchant?.api_key) return
    const fetchPayments = async () => {
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
        setPaymentsLoading(false)
      }
    }
    fetchPayments()
  }, [merchant])

  const completed = payments.filter(p => p.status === 'completed')
  const totalRevenue = completed.reduce((sum, p) => sum + Number(p.amount_usdc), 0)

  return (
    <div>
      <Topbar placeholder="Search transactions..." />
      <div style={{ padding: '32px 28px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>
              Overview
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              {loading ? 'Loading...' : `Welcome back, ${merchant?.name ?? 'Merchant'}`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{
              padding: '9px 16px', background: 'var(--bg-elevated)',
              border: '1px solid var(--border-bright)', borderRadius: 8,
              color: 'var(--text-primary)', fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>📅 Last 30 Days</button>
            <button style={{
              padding: '9px 16px',
              background: 'linear-gradient(135deg, #7c5cfc, #5a3fd4)',
              border: 'none', borderRadius: 8, color: '#fff',
              fontSize: 13, fontWeight: 600,
              boxShadow: '0 0 16px rgba(124,92,252,0.3)',
            }}>Generate Report</button>
          </div>
        </div>

        {/* Onboarding banner */}
        {merchant && !merchant.payout_wallet && (
          <div style={{
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 12, padding: '16px 20px', marginBottom: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 18 }}>⚠️</span>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--warning)' }}>
                Complete your setup to start accepting payments
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { done: false, label: 'Set your payout wallet', href: '/dashboard/settings', action: 'Go to Settings →' },
                { done: true, label: 'Copy your API key', href: '/dashboard/embed', action: 'View Embed Code →' },
                { done: false, label: 'Add embed code to your site', href: '/dashboard/embed', action: 'Get Embed Code →' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{item.done ? '✅' : '☐'}</span>
                    <span style={{ fontSize: 13, color: item.done ? 'var(--text-muted)' : 'var(--text-primary)' }}>{item.label}</span>
                  </div>
                  {!item.done && (
                    <a href={item.href} style={{ fontSize: 12, color: 'var(--warning)', fontWeight: 500 }}>{item.action}</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          <StatCard
            label="TOTAL REVENUE"
            value={`$${totalRevenue.toFixed(2)}`}
            badge="USDC"
            badgeLabel="lifetime"
            badgeColor="var(--success)"
            icon="📈"
          />
          <StatCard
            label="SUCCESSFUL PAYMENTS"
            value={String(completed.length)}
            badge={payments.length > 0 ? `${((completed.length / payments.length) * 100).toFixed(1)}% Success` : '0% Success'}
            badgeLabel="all time"
            badgeColor="var(--success)"
            icon="✅"
          />
          <StatCard
            label="PENDING PAYMENTS"
            value={String(payments.filter(p => p.status === 'pending').length)}
            badge="Pending"
            badgeLabel="awaiting payment"
            badgeColor="var(--warning)"
            icon="⏳"
          />
        </div>

        {/* API Key Card */}
        {merchant && (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 16, padding: '20px 24px', marginBottom: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>
                YOUR API KEY
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--accent)' }}>
                {merchant.api_key.slice(0, 20)}...
              </div>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(merchant.api_key)}
              style={{
                padding: '8px 16px', background: 'var(--accent-glow)',
                border: '1px solid var(--accent)', borderRadius: 8,
                color: 'var(--accent)', fontSize: 13,
              }}
            >Copy API Key</button>
          </div>
        )}

        {/* Chart */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '24px', marginBottom: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>Revenue Performance</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Financial velocity over time</div>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
                Current Period
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 200 }}>
            {CHART_DATA.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{
                  width: '100%', height: `${(val / maxVal) * 100}%`,
                  background: 'linear-gradient(180deg, #7c5cfc 0%, #4a2fa0 100%)',
                  borderRadius: '4px 4px 0 0', opacity: 0.8,
                }} />
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{MONTHS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '24px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>Recent Transactions</div>
            <button style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 13 }}>View All</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr', padding: '8px 0', marginBottom: 8, borderBottom: '1px solid var(--border)' }}>
            {['ORDER ID', 'DATE', 'AMOUNT (USDC)', 'TOKEN', 'STATUS'].map(h => (
              <div key={h} style={{ fontSize: 11, letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 500 }}>{h}</div>
            ))}
          </div>

          {paymentsLoading ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>Loading transactions...</div>
          ) : payments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
              No transactions yet. Create your first payment to get started.
            </div>
          ) : payments.slice(0, 5).map((tx, i) => (
            <div key={tx.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr',
              padding: '14px 0', alignItems: 'center',
              borderBottom: i < Math.min(payments.length, 5) - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{tx.order_id}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {new Date(tx.created_at).toLocaleDateString()}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>${Number(tx.amount_usdc).toFixed(2)}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{tx.token_received ?? '—'}</div>
              <div>
                <span style={{
                  padding: '4px 10px', borderRadius: 20,
                  fontSize: 11, fontWeight: 600,
                  background: statusBg[tx.status] ?? 'var(--bg-elevated)',
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

function StatCard({ label, value, badge, badgeLabel, badgeColor, icon }: {
  label: string; value: string; badge: string; badgeLabel: string; badgeColor: string; icon: string
}) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 16, padding: '20px 22px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
        <span style={{ fontSize: 22 }}>{icon}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ padding: '2px 8px', borderRadius: 20, background: `${badgeColor}22`, color: badgeColor, fontSize: 11, fontWeight: 600 }}>
          {badge}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{badgeLabel}</span>
      </div>
    </div>
  )
}