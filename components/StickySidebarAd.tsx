'use client'

import { useEffect, useRef, useState } from 'react'

interface StickySidebarAdProps {
  position: 'left' | 'right'
  zoneId: string
  width: number
  height: number
  className?: string
}

export default function StickySidebarAd({ 
  position, 
  zoneId, 
  width, 
  height,
  className = '' 
}: StickySidebarAdProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Só mostrar em desktop (>= 1400px)
    const checkVisibility = () => {
      setIsVisible(window.innerWidth >= 1400)
    }

    checkVisibility()
    window.addEventListener('resize', checkVisibility)

    return () => window.removeEventListener('resize', checkVisibility)
  }, [])

  useEffect(() => {
    if (!isVisible || !containerRef.current || !zoneId) return

    // Delay para evitar conflito entre ads carregando simultaneamente
    const delay = position === 'right' ? 500 : 0
    
    const timer = setTimeout(() => {
      const container = containerRef.current
      if (!container) return
      
      const uniqueId = `adsterra-${position}-${Date.now()}`
      
      // Limpar container
      container.innerHTML = ''
      
      // Criar div para o anúncio
      const adDiv = document.createElement('div')
      adDiv.id = uniqueId
      
      // Configurar atOptions globalmente
      const configScript = document.createElement('script')
      configScript.type = 'text/javascript'
      configScript.text = `
        atOptions = {
          'key': '${zoneId}',
          'format': 'iframe',
          'height': ${height},
          'width': ${width},
          'params': {}
        };
      `
      
      // Script de invocação
      const invokeScript = document.createElement('script')
      invokeScript.type = 'text/javascript'
      invokeScript.src = `//www.highperformanceformat.com/${zoneId}/invoke.js`
      
      invokeScript.onload = () => {
        console.log(`[StickySidebarAd] ${position.toUpperCase()} carregado com sucesso`)
      }
      
      invokeScript.onerror = (error) => {
        console.error(`[StickySidebarAd] ${position.toUpperCase()} erro ao carregar:`, error)
      }
      
      // Adicionar scripts ao container
      adDiv.appendChild(configScript)
      adDiv.appendChild(invokeScript)
      container.appendChild(adDiv)

      console.log(`[StickySidebarAd] ${position.toUpperCase()} carregado: ${zoneId}`)
    }, delay)

    // Cleanup
    return () => {
      clearTimeout(timer)
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [isVisible, zoneId, width, height, position])

  if (!isVisible) return null

  return (
    <div
      className={`sticky top-20 ${position === 'left' ? 'ml-4' : 'mr-4'} ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        alignSelf: 'flex-start',
      }}
    >
      <div
        ref={containerRef}
        className="bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden"
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      />
    </div>
  )
}

