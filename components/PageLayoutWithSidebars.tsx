'use client'

import { ReactNode } from 'react'
import StickySidebarAd from './StickySidebarAd'

interface PageLayoutWithSidebarsProps {
  children: ReactNode
}

export default function PageLayoutWithSidebars({ children }: PageLayoutWithSidebarsProps) {
  return (
    <div className="relative flex justify-center w-full">
      {/* Container principal com sidebars */}
      <div className="flex w-full max-w-[1600px] relative">
        
        {/* Sidebar Esquerda - AD3 (160x600) */}
        <aside className="hidden xl:block flex-shrink-0">
          <StickySidebarAd
            position="left"
            zoneId={process.env.NEXT_PUBLIC_ADSTERRA_ZONE_3 || '5f42fa3205352653220b3168bb8dc406'}
            width={160}
            height={600}
          />
        </aside>

        {/* Conteúdo Central */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

        {/* Sidebar Direita - AD4 (160x300) */}
        <aside className="hidden xl:block flex-shrink-0">
          <StickySidebarAd
            position="right"
            zoneId={process.env.NEXT_PUBLIC_ADSTERRA_ZONE_4 || '83f3195196d37b08d5c56a8f389d4a30'}
            width={160}
            height={300}
          />
        </aside>

      </div>
    </div>
  )
}

