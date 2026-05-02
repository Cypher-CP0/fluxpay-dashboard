'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Merchant {
    id: string
    name: string
    api_key: string
    payout_wallet: string
    webhook_url: string | null
    email: string | null
    created_at: string
}

interface MerchantContextType {
    merchant: Merchant | null
    loading: boolean
    refetch: () => void
}

const MerchantContext = createContext<MerchantContextType>({
    merchant: null,
    loading: true,
    refetch: () => { },
})

export function MerchantProvider({ children }: { children: ReactNode }) {
    const [merchant, setMerchant] = useState<Merchant | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchMerchant = async () => {
        setLoading(true)
        try {
            // Get API key from Supabase user metadata or localStorage
            const apiKey = localStorage.getItem('fp_api_key')
            if (!apiKey) {
                // Try to get it from backend using supabase user id
                const supabase = createClient()
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/merchants/by-user/${user.id}`
                )
                if (!res.ok) return
                const data = await res.json()
                localStorage.setItem('fp_api_key', data.api_key)
                setMerchant(data)
            } else {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/merchants/me`,
                    { headers: { 'x-api-key': apiKey } }
                )
                if (!res.ok) {
                    localStorage.removeItem('fp_api_key')
                    return
                }
                const data = await res.json()
                setMerchant(data)
            }
        } catch (err) {
            console.error('Failed to fetch merchant:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchMerchant() }, [])

    return (
        <MerchantContext.Provider value={{ merchant, loading, refetch: fetchMerchant }}>
            {children}
        </MerchantContext.Provider>
    )
}

export function useMerchant() {
    return useContext(MerchantContext)
}