'use client'

import { useEffect, useState } from 'react'

interface GoogleAdProps {
  adSlot: string
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  style?: React.CSSProperties
  className?: string
  shouldRender?: boolean // Nova prop para controlar renderização baseada em conteúdo
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
  className = '',
  shouldRender = true // Por padrão, renderiza se não especificado
}: GoogleAdProps) {
  // O script do Google AdSense já está no <head> do layout com o client ID
  // Usar o Publisher ID do script ou da variável de ambiente
  const publisherId = process.env.NEXT_PUBLIC_GOOGLE_ADS_PUBLISHER_ID || 'ca-pub-1782940009467994'
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Só renderizar anúncios se shouldRender for true e após um pequeno delay
    // para garantir que o conteúdo principal já foi carregado
    if (!shouldRender) {
      setIsReady(false)
      return
    }

    // O script do Google AdSense já está no <head> do layout
    // Aguardar um pouco para garantir que o conteúdo principal foi renderizado
    if (typeof window !== 'undefined') {
      // Delay maior para garantir que o conteúdo está visível
      const timer = setTimeout(() => {
        setIsReady(true)
        // Aguardar mais um pouco antes de inicializar o anúncio
        setTimeout(() => {
          try {
            // @ts-ignore - adsbygoogle é injetado pelo script do Google
            if (window.adsbygoogle) {
              (window.adsbygoogle = window.adsbygoogle || []).push({})
            }
          } catch (err) {
            // Silenciar erros do Google Ads (são comuns durante aprovação)
          }
        }, 200)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [adSlot, shouldRender])

  // Não renderizar se shouldRender for false ou se ainda não estiver pronto
  if (!shouldRender || !isReady) {
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

