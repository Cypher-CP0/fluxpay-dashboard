'use client'
import { useState, useEffect } from 'react'
import Topbar from '@/components/Topbar'
import { useMerchant } from '@/lib/merchantContext'

const RECENT_ACTIVITY = [
  { icon: '✏️', title: 'Webhook Endpoint Updated', desc: 'Modified by Admin (James W.)', time: '2 hours ago', status: 'SUCCESS' },
  { icon: '🔑', title: 'New API Key Generated', desc: 'New secret key created for dev_v3', time: 'May 12, 14:22', status: 'SUCCESS' },
  { icon: '🔄', title: 'Payout Address Modification Failed', desc: 'Two-factor authentication required', time: 'May 11, 09:15', status: 'DENIED' },
]

export default function SettingsPage() {
  const { merchant, refetch } = useMerchant()
  const [payoutWallet, setPayoutWallet] = useState('')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    console.log('merchant data:', merchant)
    if (merchant) {
      setPayoutWallet(merchant.payout_wallet ?? '')
      setWebhookUrl(merchant.webhook_url ?? '')
    }
  }, [merchant])

  const handleSave = async () => {
    if (!merchant) return
    setSaving(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': merchant.api_key,
        },
        body: JSON.stringify({ payout_wallet: payoutWallet, webhook_url: webhookUrl }),
      })
      if (!res.ok) throw new Error('Failed to save')
      refetch()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(payoutWallet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <Topbar placeholder="Search parameters..." />

      <div style={{ padding: '32px 28px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 6 }}>
              FLUXPAY MANAGEMENT
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em',
            }}>Workspace Configuration</h1>
          </div>
          <div style={{
            padding: '6px 14px',
            background: 'var(--success-bg)',
            border: '1px solid rgba(34,211,165,0.2)',
            borderRadius: 20,
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: 'var(--success)', fontWeight: 500,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
            Kinetic Live
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Payout Wallet */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 40, height: 40,
                  background: 'rgba(124,92,252,0.15)',
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>💳</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600 }}>Payout Wallet</div>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
                Your primary settlement address. All successfully processed kinetic transactions will be batched and released here every 24 hours.
              </p>
              <div style={{ fontSize: 11, letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>
                SETTLEMENT ADDRESS
              </div>
              <div style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border-bright)',
                borderRadius: 8, padding: '12px 14px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{
                  fontFamily: 'monospace', fontSize: 13,
                  color: 'var(--accent)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  maxWidth: '85%',
                }}>
                  {payoutWallet.slice(0, 8)}...{payoutWallet.slice(-10)}
                </span>
                <button onClick={copyAddress} style={{
                  background: 'none', border: 'none',
                  color: copied ? 'var(--success)' : 'var(--text-muted)',
                  fontSize: 16, cursor: 'pointer',
                }}>📋</button>
              </div>
              <input
                type="text"
                value={payoutWallet}
                onChange={e => setPayoutWallet(e.target.value)}
                placeholder="Solana wallet address"
                style={{
                  width: '100%', marginTop: 10, padding: '10px 12px',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-bright)',
                  borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-bright)'}
              />
            </div>

            {/* Webhook URL */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 40, height: 40, background: 'rgba(124,92,252,0.15)',
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>✦</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600 }}>Webhook URL</div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
                Automate your workflow by receiving real-time event notifications. FluxPay will send a POST request to this endpoint whenever a kinetic event occurs.
              </p>
              <div style={{ fontSize: 11, letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>
                PRODUCTION ENDPOINT
              </div>
              <input
                type="text"
                value={webhookUrl}
                onChange={e => setWebhookUrl(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-bright)',
                  borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, outline: 'none',
                  marginBottom: 14,
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-bright)'}
              />
              <button onClick={handleSave} style={{
                padding: '11px 28px',
                background: saved ? 'var(--success)' : 'linear-gradient(135deg, #7c5cfc, #5a3fd4)',
                border: 'none', borderRadius: 8, color: '#fff',
                fontSize: 14, fontWeight: 600,
                boxShadow: '0 0 16px rgba(124,92,252,0.25)',
              }}>
                {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Developer API */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 40, height: 40, background: 'rgba(124,92,252,0.15)',
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>🔌</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600 }}>Developer API</div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
                Integrate the FluxPay Kinetic Engine directly into your stack. Use our REST API to generate dynamic checkout sessions, manage recurring kinetic streams, and handle automated payouts.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {[{ icon: '📄', label: 'Documentation' }, { icon: '🔑', label: 'API Keys' }].map(item => (
                  <button key={item.label} style={{
                    padding: '12px 16px',
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-bright)',
                    borderRadius: 8, color: 'var(--text-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontSize: 14,
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{item.icon}</span> {item.label}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>›</span>
                  </button>
                ))}
              </div>
              {/* Mini code preview */}
              <div style={{
                background: '#0d0d1a', border: '1px solid var(--border)',
                borderRadius: 8, padding: '12px', fontFamily: 'monospace', fontSize: 11,
                color: '#a78bfa', lineHeight: 1.8,
              }}>
                <div style={{ color: 'var(--text-muted)' }}># Fetch current session</div>
                <div>curl -X GET \</div>
                <div style={{ paddingLeft: 8 }}>"https://api.fluxpay.io/v1/kinetic..." \</div>
                <div style={{ paddingLeft: 8 }}>-H "Authorization: Bearer ••••"</div>
              </div>
            </div>

            {/* Account info */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 40, height: 40,
                background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
              }}>FP</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>FluxPay</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Kinetic Engine</div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <span style={{
                  padding: '3px 10px', borderRadius: 20,
                  background: 'var(--success-bg)', color: 'var(--success)',
                  fontSize: 11, fontWeight: 600,
                }}>ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Settings Activity */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '24px', marginTop: 16,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600 }}>
              Recent Settings Activity
            </div>
            <button style={{
              background: 'none', border: 'none',
              color: 'var(--accent)', fontSize: 13,
            }}>View Full Audit Trail</button>
          </div>

          {RECENT_ACTIVITY.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 0',
              borderBottom: i < RECENT_ACTIVITY.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 36, height: 36,
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-bright)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.time}</span>
                <span style={{
                  padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                  background: item.status === 'SUCCESS' ? 'var(--success-bg)' : 'var(--error-bg)',
                  color: item.status === 'SUCCESS' ? 'var(--success)' : 'var(--error)',
                }}>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}