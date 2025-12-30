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
  const [userCountry, setUserCountry] = useState<string | null>(null)

  useEffect(() => {
    if (!shouldRender) {
      return
    }

    // Determinar qual provider usar
    determineProvider()

    // Detectar pais do usuario para otimizacao geografica
    detectUserCountry()
  }, [shouldRender, provider, preferredProvider])

  const determineProvider = () => {
    // Se provider especificado, usar diretamente
    if (provider === 'google' || provider === 'adsterra') {
      setActiveProvider(provider)
      return
    }

    // Modo auto: detectar baseado em variaveis de ambiente
    const envProvider = process.env.NEXT_PUBLIC_ADS_PROVIDER

    if (envProvider === 'google') {
      setActiveProvider('google')
    } else if (envProvider === 'adsterra') {
      setActiveProvider('adsterra')
    } else if (envProvider === 'hybrid') {
      // Modo hibrido: usar preferencia ou detectar
      useHybridStrategy()
    } else {
      // Fallback: usar preferencia
      setActiveProvider(preferredProvider)
    }
  }

  const useHybridStrategy = () => {
    // Estrategia 1: Verificar se Google AdSense esta aprovado
    // (Podemos detectar isso verificando se os anuncios carregam)
    const googleApproved = checkGoogleApproval()

    if (googleApproved) {
      // Google aprovado: usar baseado em geografia
      if (userCountry && isTier1Country(userCountry)) {
        setActiveProvider('google') // Tier 1: Google (maior CPM)
      } else {
        setActiveProvider('adsterra') // Tier 2/3: Adsterra (aceita melhor)
      }
    } else {
      // Google nao aprovado: usar Adsterra
      setActiveProvider('adsterra')
    }
  }

  const checkGoogleApproval = (): boolean => {
    // Verificar se temos Publisher ID do Google configurado
    const googlePublisherId = process.env.NEXT_PUBLIC_GOOGLE_ADS_PUBLISHER_ID
    
    // Se nao tiver ID, Google nao esta configurado
    if (!googlePublisherId) {
      return false
    }

    // Podemos adicionar logica mais sofisticada aqui
    // Por exemplo, fazer uma requisicao de teste
    // Por enquanto, assumir que se tem ID, pode estar aprovado
    
    // TODO: Implementar verificacao real de aprovacao
    return false // Retornar false ate Google aprovar
  }

  const detectUserCountry = async () => {
    try {
      // Usar API gratuita para detectar pais
      // Alternativa: usar Cloudflare headers, Vercel geolocation, etc
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      setUserCountry(data.country_code)
    } catch (error) {
      // Fallback: usar preferencia padrao
      console.log('Nao foi possivel detectar pais do usuario')
    }
  }

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
    return (
      <AdsterraAd
        zoneId={adsterraZoneId}
        format={adFormat === 'auto' ? 'banner' : 'banner'}
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

