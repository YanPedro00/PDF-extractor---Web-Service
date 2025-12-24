'use client'

import { useEffect } from 'react'

interface GoogleAdProps {
  adSlot: string
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  style?: React.CSSProperties
  className?: string
}

/**
 * Componente para exibir anúncios do Google Ads
 * 
 * INSTRUÇÕES PARA CONFIGURAR:
 * 
 * 1. Acesse https://www.google.com/adsense/
 * 2. Crie uma conta ou faça login
 * 3. Adicione seu site
 * 4. Crie unidades de anúncio (Ad Units)
 * 5. Copie o código do publisher ID (ex: ca-pub-1234567890123456)
 * 6. Para cada localização, crie uma unidade de anúncio diferente
 * 7. Copie o ad-slot ID de cada unidade (ex: 1234567890)
 * 
 * 8. Configure as variáveis de ambiente:
 *    - Crie um arquivo .env.local na raiz do projeto
 *    - Adicione: NEXT_PUBLIC_GOOGLE_ADS_PUBLISHER_ID=ca-pub-XXXXXXXXXX
 * 
 * 9. Use o componente assim:
 *    <GoogleAd adSlot="1234567890" adFormat="auto" />
 */
export default function GoogleAd({ 
  adSlot, 
  adFormat = 'auto',
  style,
  className = ''
}: GoogleAdProps) {
  const publisherId = process.env.NEXT_PUBLIC_GOOGLE_ADS_PUBLISHER_ID

  useEffect(() => {
    if (!publisherId) {
      console.warn('Google Ads Publisher ID não configurado. Configure NEXT_PUBLIC_GOOGLE_ADS_PUBLISHER_ID no .env.local')
      return
    }

    // Carregar script do Google Ads
    const script = document.createElement('script')
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`
    script.async = true
    script.crossOrigin = 'anonymous'
    document.head.appendChild(script)

    // Inicializar anúncio após o script carregar
    script.onload = () => {
      try {
        // @ts-ignore - adsbygoogle é injetado pelo script do Google
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error('Erro ao inicializar Google Ad:', err)
      }
    }

    return () => {
      // Limpar script ao desmontar
      const existingScript = document.querySelector(`script[src*="adsbygoogle"]`)
      if (existingScript) {
        // Não removemos o script pois pode ser usado por outros anúncios
      }
    }
  }, [publisherId])

  if (!publisherId) {
    // Em desenvolvimento, mostrar placeholder
    if (process.env.NODE_ENV === 'development') {
      return (
        <div 
          className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${className}`}
          style={style}
        >
          <p className="text-gray-500 text-sm">
            Google Ad Placeholder
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Ad Slot: {adSlot}
          </p>
          <p className="text-gray-400 text-xs">
            Configure NEXT_PUBLIC_GOOGLE_ADS_PUBLISHER_ID no .env.local
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className={`google-ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...style
        }}
        data-ad-client={publisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  )
}

// Declaração de tipo para window.adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

