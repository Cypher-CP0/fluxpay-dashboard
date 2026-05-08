'use client'
import Topbar from '@/components/Topbar'
import { useMerchant } from '@/lib/merchantContext'

export default function PayoutsPage() {
    const { merchant } = useMerchant()

    return (
        <div>
            <Topbar placeholder="Search payouts..." />
            <div style={{ padding: '32px 28px' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
                    Payouts
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
                    USDC settlements to your payout wallet.
                </p>

                <div style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 16, padding: '24px', marginBottom: 20,
                }}>
                    <div style={{ fontSize: 11, letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>
                        CURRENT PAYOUT WALLET
                    </div>
                    {merchant?.payout_wallet ? (
                        <div style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--accent)' }}>
                            {merchant.payout_wallet}
                        </div>
                    ) : (
                        <div style={{ color: 'var(--warning)', fontSize: 14 }}>
                            ⚠️ No payout wallet configured.{' '}
                            <a href="/dashboard/settings" style={{ color: 'var(--accent)' }}>Set it in Settings →</a>
                        </div>
                    )}
                </div>

                <div style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 16, padding: '64px', textAlign: 'center',
                }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>💸</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                        No payouts yet
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                        USDC from completed payments lands directly in your payout wallet on-chain.
                        Every completed payment is a direct on-chain transfer — no batching, no delays.
                    </p>
                </div>
            </div>
        </div>
    )
}