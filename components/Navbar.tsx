'use client'

import { useState } from 'react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const tools = [
    { id: 'text', name: 'PDF para Excel' },
    { id: 'ocr', name: 'PDF Escaneado' },
    { id: 'merge', name: 'Juntar PDFs' },
    { id: 'split', name: 'Dividir PDF' },
  ]

  const handleToolClick = (toolId: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    window.dispatchEvent(new CustomEvent('changeTool', { detail: toolId }))
    setIsMenuOpen(false) // Fechar menu mobile após clicar
  }

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    window.dispatchEvent(new CustomEvent('changeTool', { detail: null }))
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo e Nome */}
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleHomeClick}
          >
            <img
              src="/logo.png"
              alt="PDFUtilities Logo"
              width={32}
              height={32}
              className="sm:w-10 sm:h-10 object-contain"
            />
            <span className="text-lg sm:text-2xl font-bold text-primary-600">PDFUtilities</span>
          </div>

          {/* Menu Desktop - Ferramentas */}
          <div className="hidden md:flex items-center gap-1 lg:gap-3">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool.id)}
                className="px-3 lg:px-4 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium text-sm lg:text-base"
              >
                {tool.name}
              </button>
            ))}
          </div>

          {/* Botão Menu Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Mobile - Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="flex flex-col py-2">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool.id)}
                  className="px-4 py-3 text-left text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium text-sm"
                >
                  {tool.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

