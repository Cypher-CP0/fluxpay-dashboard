'use client'
import { useState } from 'react'
import Topbar from '@/components/Topbar'
import { useMerchant } from '@/lib/merchantContext'

export default function EmbedPage() {
  const { merchant } = useMerchant()
  const [copied, setCopied] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  const apiKey = merchant?.api_key ?? 'fp_live_YOUR_KEY_HERE'

  const CODE_SNIPPET = `// Initialize FluxPay Kinetic Engine
import FluxPay from '@fluxpay/widget'

FluxPay.init({
  apiUrl: 'https://api.fluxpay.io',
  apiKey: '${apiKey}',
  onSuccess: (payment) => {
    console.log('Payment confirmed', payment)
    // redirect or update your UI
  },
  onExpired: () => console.log('Payment expired'),
})

// Call this when user clicks checkout
async function initializeCheckout(orderId, amountUsdc) {
  const res = await fetch('/api/create-payment', {
    method: 'POST',
    body: JSON.stringify({ order_id: orderId, amount_usdc: amountUsdc }),
  })
  const { payment_id } = await res.json()
  FluxPay.open(payment_id)
}`

  const copyCode = () => {
    navigator.clipboard.writeText(CODE_SNIPPET)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const steps = [
    { num: '01', title: 'Initialize SDK', desc: "Import the FluxPay client-side library into your project's main entry point." },
    { num: '02', title: 'Pass API Keys', desc: 'Securely authenticate using your kinetic publishable key from the dashboard.' },
    { num: '03', title: 'Mount Terminal', desc: 'Select a DOM element to inject the zero-latency payment interface.' },
  ]

  return (
    <div>
      <Topbar placeholder="Search operations..." />
      <div style={{ padding: '32px 28px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{
              fontSize: 11, letterSpacing: '0.12em', color: 'var(--accent)',
              fontWeight: 600, padding: '3px 10px',
              background: 'var(--accent-glow)', borderRadius: 4,
            }}>INTEGRATION</span>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
            Embed Snippet
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 580, lineHeight: 1.6 }}>
            Deploy the FluxPay checkout experience into your existing platform with a single line of code.
          </p>
        </div>

        {/* API Key banner */}
        {merchant && (
          <div style={{
            background: 'rgba(124,92,252,0.06)', border: '1px solid rgba(124,92,252,0.2)',
            borderRadius: 12, padding: '14px 18px', marginBottom: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 4 }}>
                YOUR API KEY — already included in the snippet below
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--accent)' }}>
                {merchant.api_key}
              </div>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(merchant.api_key)}
              style={{
                padding: '7px 14px', background: 'var(--accent-glow)',
                border: '1px solid var(--accent)', borderRadius: 8,
                color: 'var(--accent)', fontSize: 12, cursor: 'pointer',
              }}
            >Copy Key</button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 16 }}>
          {/* Left */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px' }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>✦</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 24 }}>
              How it works
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {steps.map((step, i) => (
                <div key={step.num} onClick={() => setActiveStep(i)}
                  style={{ display: 'flex', gap: 14, cursor: 'pointer', opacity: activeStep === i ? 1 : 0.6 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: activeStep === i ? 'var(--accent-glow)' : 'var(--bg-elevated)',
                    border: `1px solid ${activeStep === i ? 'var(--accent)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700,
                    color: activeStep === i ? 'var(--accent)' : 'var(--text-muted)',
                  }}>{step.num}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{step.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 28, padding: '16px',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-bright)',
              borderRadius: 10,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>SECURITY PROTOCOL</div>
                <span>🛡</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                All embedded snippets are end-to-end encrypted. We never expose your private keys to the client-side browser environment.
              </p>
              <a href="#" style={{ fontSize: 12, color: 'var(--accent)', display: 'block', marginTop: 10 }}>
                View Documentation →
              </a>
            </div>
          </div>

          {/* Right — Code */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', background: 'var(--bg-elevated)',
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  {['#ff5f57', '#ffbd2e', '#28ca41'].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                  ))}
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>checkout-integration.js</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ padding: '2px 8px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 11, color: 'var(--text-muted)' }}>ES6+</span>
                <span style={{ padding: '2px 8px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 11, color: 'var(--text-muted)' }}>UTF-8</span>
              </div>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
              <pre style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 1.8, color: '#c9d1d9', margin: 0, whiteSpace: 'pre-wrap' }}>
                {CODE_SNIPPET.split('\n').map((line, i) => (
                  <div key={i}>
                    {line.startsWith('//') ? (
                      <span style={{ color: '#6a737d' }}>{line}</span>
                    ) : line.includes("'") ? (
                      <span dangerouslySetInnerHTML={{ __html: line.replace(/'([^']*)'/g, "<span style='color:#a5d6ff'>'$1'</span>") }} />
                    ) : (
                      <span>{line}</span>
                    )}
                  </div>
                ))}
              </pre>
            </div>

            <div style={{ padding: '12px 20px 20px', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12 }}>
                READY FOR DEPLOYMENT
              </div>
              <button onClick={copyCode} style={{
                width: '100%', padding: '13px',
                background: copied ? 'var(--success)' : 'linear-gradient(135deg, #7c5cfc, #5a3fd4)',
                border: 'none', borderRadius: 10, color: '#fff',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 0 20px rgba(124,92,252,0.25)',
              }}>
                📋 {copied ? 'Copied!' : 'Copy Code Snippet'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 16 }}>
          {[
            { label: 'SDK LATENCY', value: '42ms', sub: 'OPTIMIZED FOR SCALE', color: 'var(--accent)' },
            { label: 'SECURITY STATUS', value: 'AES-256', sub: 'LEVEL 1 PCI COMPLIANT', color: 'var(--success)' },
            { label: 'UPTIME', value: '99.99%', sub: 'GLOBAL EDGE NODES', color: 'var(--warning)' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '20px 22px', borderTop: `2px solid ${stat.color}`,
            }}>
              <div style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 8 }}>{stat.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 11, letterSpacing: '0.08em', color: 'var(--text-muted)' }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}