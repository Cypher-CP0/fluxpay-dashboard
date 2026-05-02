'use client'

export default function Topbar({ placeholder = 'Search...' }: { placeholder?: string }) {
  return (
    <header style={{
      height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-surface)',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      {/* Search */}
      <div style={{ position: 'relative', width: 280 }}>
        <span style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-muted)', fontSize: 14,
        }}>🔍</span>
        <input
          type="text"
          placeholder={placeholder}
          style={{
            width: '100%', padding: '8px 12px 8px 36px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 8, color: 'var(--text-primary)',
            fontSize: 13, outline: 'none',
          }}
        />
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button style={{
          background: 'none', border: 'none',
          color: 'var(--text-secondary)', fontSize: 18,
        }}>🔔</button>
        <button style={{
          background: 'none', border: 'none',
          color: 'var(--text-secondary)', fontSize: 18,
        }}>❓</button>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>M</div>
      </div>
    </header>
  )
}
