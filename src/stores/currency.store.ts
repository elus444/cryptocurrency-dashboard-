import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Currency } from '@/types'

// ─── Currency Store ────────────────────────────────────────────────────────
// Persists the user's preferred display currency across sessions.

interface CurrencyState {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: 'USD',
      setCurrency: (currency) => set({ currency }),
    }),
    { name: 'saasnav-currency' }
  )
)
