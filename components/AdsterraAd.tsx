'use client'

import { useEffect, useRef, useState } from 'react'

interface AdsterraAdProps {
  zoneId: string
  format?: 'banner' | 'popunder' | 'native' | 'social-bar'
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
  shouldRender?: boolean
}

/**
 * Componente para exibir anuncios do Adsterra
 * 
 * INSTRUCOES PARA CONFIGURAR:
 * 
 * 1. Acesse https://publishers.adsterra.com/referral/VHae2wCop0
 * 2. Crie uma conta e verifique seu email
 * 3. Adicione seu site e aguarde aprovacao (24-48h)
 * 4. Crie Ad Zones (unidades de anuncio)
 * 5. Copie o Publisher ID e os Zone IDs
 * 
 * 6. Configure as variaveis de ambiente:
 *    - Crie ou edite o arquivo .env.local na raiz do projeto
 *    - Adicione:
 *      NEXT_PUBLIC_ADSTERRA_PUBLISHER_ID=seu_id_aqui
 *      NEXT_PUBLIC_ADSTERRA_ZONE_1=zone_id_1
 *      NEXT_PUBLIC_ADSTERRA_ZONE_2=zone_id_2
 *      NEXT_PUBLIC_ADS_PROVIDER=adsterra (ou "hybrid" para usar com Google)
 * 
 * 7. Use o componente assim:
 *    <AdsterraAd zoneId={process.env.NEXT_PUBLIC_ADSTERRA_ZONE_1 || ''} />
 * 
 * FORMATOS DISPONIVEIS:
 * - banner: Banners tradicionais (responsivos ou tamanho fixo)
 * - popunder: Janelas pop-under (maior CPM, mas intrusivo)
 * - native: Anuncios nativos (melhor UX)
 * - social-bar: Barra social no rodape
 */
export default function AdsterraAd({ 
  zoneId, 
  format = 'banner',
  width,
  height,
  className = '',
  style,
  shouldRender = true
}: AdsterraAdProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [adLoaded, setAdLoaded] = useState(false)

  // Obter Publisher ID do ambiente ou usar placeholder
  const publisherId = process.env.NEXT_PUBLIC_ADSTERRA_PUBLISHER_ID || ''

  useEffect(() => {
    // Validacoes iniciais
    if (!shouldRender) {
      setIsReady(false)
      return
    }

    if (!zoneId) {
      console.warn('AdsterraAd: Zone ID nao configurado')
      return
    }

    // Native banners nao precisam de Publisher ID
    if (format !== 'native' && !publisherId) {
      console.warn('AdsterraAd: Publisher ID nao configurado')
      return
    }

    // Aguardar um pouco para garantir que o conteudo principal foi renderizado
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        setIsReady(true)

        // Carregar o script dinamicamente
        if (!adLoaded) {
          loadAdScript()
        }
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [shouldRender, zoneId, publisherId, format, adLoaded])

  const loadAdScript = () => {
    try {
      // Verificar se o script ja foi carregado
      const existingScript = document.querySelector(`script[data-zone="${zoneId}"]`)
      if (existingScript) {
        return
      }

      // Criar e adicionar o script do Adsterra
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.setAttribute('data-zone', zoneId)
      script.setAttribute('data-cfasync', 'false')
      
      // URL especifica para native banners
      if (format === 'native') {
        script.src = `https://pl28361258.effectivegatecpm.com/${zoneId}/invoke.js`
      } else {
        script.src = `https://a.magsrv.com/ad-provider.js`
      }

      if (adRef.current) {
        adRef.current.appendChild(script)
        setAdLoaded(true)
      }
    } catch (err) {
      console.error('Erro ao carregar anuncio Adsterra:', err)
    }
  }

  // Nao renderizar se shouldRender for false ou se nao estiver pronto
  if (!shouldRender || !isReady || !zoneId) {
    return null
  }
  
  // Para formatos que nao sejam native, validar Publisher ID
  if (format !== 'native' && !publisherId) {
    return null
  }

  // Estilos baseados no formato
  const getAdStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      display: 'block',
      margin: '0 auto',
      textAlign: 'center',
      ...style
    }

    if (width && height) {
      return {
        ...baseStyles,
        width: `${width}px`,
        height: `${height}px`
      }
    }

    // Estilos padrao por formato
    switch (format) {
      case 'banner':
        return {
          ...baseStyles,
          minHeight: '100px',
          maxWidth: '100%'
        }
      case 'native':
        return {
          ...baseStyles,
          minHeight: '250px'
        }
      case 'social-bar':
        return {
          ...baseStyles,
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999
        }
      default:
        return baseStyles
    }
  }

  return (
    <div 
      className={`adsterra-ad-container ${className}`} 
      style={getAdStyles()}
      data-ad-provider="adsterra"
      data-ad-zone={zoneId}
    >
      {/* Container para Native Banner */}
      {format === 'native' && (
        <>
          <div ref={adRef} />
          <div id={`container-${zoneId}`} />
        </>
      )}
      
      {/* Container para Display Banner */}
      {format === 'banner' && (
        <div ref={adRef}>
          <ins 
            className="adsbyadsterra" 
            data-ad-client={publisherId}
            data-ad-slot={zoneId}
            style={{ display: 'block' }}
          />
        </div>
      )}
      
      {/* Outros formatos */}
      {(format === 'popunder' || format === 'social-bar') && (
        <div ref={adRef} />
      )}
    </div>
  )
}

// Tipos globais para Adsterra
declare global {
  interface Window {
    adsbyadsterra?: any
  }
}

