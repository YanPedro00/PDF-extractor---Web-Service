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
  // O script do Google AdSense já está no <head> do layout com o client ID
  // Usar o Publisher ID do script ou da variável de ambiente
  const publisherId = process.env.NEXT_PUBLIC_GOOGLE_ADS_PUBLISHER_ID || 'ca-pub-1782940009467994'

  useEffect(() => {
    // O script do Google AdSense já está no <head> do layout
    // Apenas inicializar o anúncio quando o componente montar
    if (typeof window !== 'undefined') {
      // Aguardar um pouco para garantir que o script foi carregado
      const timer = setTimeout(() => {
        try {
          // @ts-ignore - adsbygoogle é injetado pelo script do Google
          if (window.adsbygoogle) {
            (window.adsbygoogle = window.adsbygoogle || []).push({})
          }
        } catch (err) {
          // Silenciar erros do Google Ads (são comuns durante aprovação)
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [adSlot])

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

