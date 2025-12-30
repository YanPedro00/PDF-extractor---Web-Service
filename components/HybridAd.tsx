'use client'

import { useEffect, useState } from 'react'
import GoogleAd from './GoogleAd'
import AdsterraAd from './AdsterraAd'

interface HybridAdProps {
  // Google AdSense props
  googleAdSlot?: string
  // Adsterra props
  adsterraZoneId?: string
  // Compartilhados
  adFormat?: 'auto' | 'banner' | 'native'
  className?: string
  style?: React.CSSProperties
  shouldRender?: boolean
  // Configuracao hibrida
  provider?: 'google' | 'adsterra' | 'auto'
  preferredProvider?: 'google' | 'adsterra'
}

/**
 * Componente Hibrido para gerenciar Google AdSense e Adsterra
 * 
 * ESTRATEGIA HIBRIDA:
 * 
 * 1. INICIO: Usar Adsterra enquanto Google AdSense nao aprovar
 * 2. APROVACAO: Quando Google aprovar, alternar automaticamente
 * 3. OTIMIZACAO: Usar Google para Tier 1, Adsterra para Tier 2/3
 * 
 * MODOS DE OPERACAO:
 * 
 * - provider="adsterra": Usa apenas Adsterra
 * - provider="google": Usa apenas Google AdSense
 * - provider="auto": Detecta automaticamente qual usar
 * 
 * CONFIGURACAO:
 * 
 * No .env.local:
 * NEXT_PUBLIC_ADS_PROVIDER=adsterra (ou "google" ou "hybrid")
 * 
 * USO:
 * 
 * <HybridAd 
 *   googleAdSlot="123456"
 *   adsterraZoneId="789012"
 *   provider="auto"
 * />
 */
export default function HybridAd({ 
  googleAdSlot,
  adsterraZoneId,
  adFormat = 'auto',
  className = '',
  style,
  shouldRender = true,
  provider = 'auto',
  preferredProvider = 'google'
}: HybridAdProps) {
  const [activeProvider, setActiveProvider] = useState<'google' | 'adsterra' | null>(null)

  useEffect(() => {
    if (!shouldRender) {
      return
    }

    // Determinar qual provider usar
    if (provider === 'google' || provider === 'adsterra') {
      setActiveProvider(provider)
    } else {
      // Modo auto: detectar baseado em variaveis de ambiente
      const envProvider = process.env.NEXT_PUBLIC_ADS_PROVIDER
      
      if (envProvider === 'adsterra' || !envProvider) {
        setActiveProvider('adsterra')
      } else if (envProvider === 'google') {
        setActiveProvider('google')
      } else {
        setActiveProvider('adsterra')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRender, provider, preferredProvider])

  const isTier1Country = (countryCode: string): boolean => {
    const tier1Countries = [
      'US', // Estados Unidos
      'CA', // Canada
      'GB', // Reino Unido
      'AU', // Australia
      'DE', // Alemanha
      'FR', // Franca
      'NL', // Holanda
      'SE', // Suecia
      'NO', // Noruega
      'DK', // Dinamarca
      'CH', // Suica
      'IE', // Irlanda
      'NZ', // Nova Zelandia
      'AT', // Austria
      'BE', // Belgica
      'FI'  // Finlandia
    ]

    return tier1Countries.includes(countryCode)
  }

  // Nao renderizar se shouldRender for false
  if (!shouldRender) {
    return null
  }

  // Nao renderizar se nenhum provider foi determinado
  if (!activeProvider) {
    return null
  }

  // Renderizar Google AdSense
  if (activeProvider === 'google' && googleAdSlot) {
    return (
      <GoogleAd
        adSlot={googleAdSlot}
        adFormat={adFormat}
        className={className}
        style={style}
        shouldRender={shouldRender}
      />
    )
  }

  // Renderizar Adsterra
  if (activeProvider === 'adsterra' && adsterraZoneId) {
    // Detectar formato baseado no zoneId
    let detectedFormat: 'native' | 'banner' | 'social-bar' | 'iframe' = 'banner'
    
    if (adsterraZoneId.includes('http')) {
      // Social Bar (URL completa)
      detectedFormat = 'social-bar'
    } else if (adsterraZoneId.startsWith('f9b1fc')) {
      // Native Banner (ZONE_1)
      detectedFormat = 'native'
    } else if (adsterraZoneId.startsWith('678540')) {
      // iframe Banner (ZONE_2)
      detectedFormat = 'iframe'
    }
    
    return (
      <AdsterraAd
        zoneId={adsterraZoneId}
        format={detectedFormat}
        className={className}
        style={style}
        shouldRender={shouldRender}
      />
    )
  }

  // Fallback: nao renderizar nada
  return null
}

/**
 * Hook customizado para gerenciar ads hibridos
 * 
 * USO:
 * const { provider, isGoogleApproved } = useHybridAds()
 */
export function useHybridAds() {
  const [provider, setProvider] = useState<'google' | 'adsterra'>('adsterra')
  const [isGoogleApproved, setIsGoogleApproved] = useState(false)

  useEffect(() => {
    // Verificar configuracao
    const envProvider = process.env.NEXT_PUBLIC_ADS_PROVIDER

    if (envProvider === 'google') {
      setProvider('google')
      setIsGoogleApproved(true)
    } else if (envProvider === 'adsterra') {
      setProvider('adsterra')
      setIsGoogleApproved(false)
    } else if (envProvider === 'hybrid') {
      // Por padrao, usar Adsterra ate Google aprovar
      setProvider('adsterra')
      // TODO: Implementar verificacao automatica
    }
  }, [])

  return {
    provider,
    isGoogleApproved,
    setProvider,
    setIsGoogleApproved
  }
}

