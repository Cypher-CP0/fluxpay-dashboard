import Sidebar from '@/components/Sidebar'
import { MerchantProvider } from '@/lib/merchantContext'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <MerchantProvider>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{
          marginLeft: 'var(--sidebar-width)',
          flex: 1,
          background: 'var(--bg-base)',
          minHeight: '100vh',
        }}>
          {children}
        </main>
      </div>
    </MerchantProvider>
  )
}