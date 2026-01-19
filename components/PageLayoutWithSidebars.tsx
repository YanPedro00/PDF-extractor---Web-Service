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
            zoneId={process.env.NEXT_PUBLIC_ADSTERRA_ZONE_3 || '924213682326bfedd01d92b57944caaa'}
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
            zoneId={process.env.NEXT_PUBLIC_ADSTERRA_ZONE_4 || 'b5c327689ccc6f9ceb052baf673ad19d'}
            width={160}
            height={300}
          />
        </aside>

      </div>
    </div>
  )
}

