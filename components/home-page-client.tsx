'use client'

import { AccessibilityControls } from '@/components/accessibility-controls'
import { OfflineIndicator } from '@/components/offline-indicator'

interface HomePageClientProps {
  children: React.ReactNode
}

export function HomePageClient({ children }: HomePageClientProps) {
  return (
    <>
      {children}
      <AccessibilityControls />
      <OfflineIndicator />
    </>
  )
}