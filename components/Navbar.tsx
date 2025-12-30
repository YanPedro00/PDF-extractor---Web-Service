'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  
  const tools = [
    { href: '/converter', name: 'PDF para Excel' },
    { href: '/ocr', name: 'PDF para Excel (OCR)' },
    { href: '/juntar', name: 'Juntar PDFs' },
    { href: '/dividir', name: 'Dividir PDF' },
    { href: '/comprimir', name: 'Comprimir PDF' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo e Nome */}
          <a 
            href="/"
            className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="PDFUtilities Logo"
              width={32}
              height={32}
              className="sm:w-10 sm:h-10 object-contain"
            />
            <span className="text-lg sm:text-2xl font-bold text-primary-600">PDFUtilities</span>
          </a>

          {/* Menu Desktop - Ferramentas */}
          <div className="hidden md:flex items-center gap-1 lg:gap-3">
            {tools.map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                className={`px-3 lg:px-4 py-2 rounded-lg transition-colors font-medium text-sm lg:text-base ${
                  isActive(tool.href)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                {tool.name}
              </a>
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
                <a
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 text-left transition-colors font-medium text-sm ${
                    isActive(tool.href)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                >
                  {tool.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
