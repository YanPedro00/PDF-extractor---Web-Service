'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()
  
  // Primeiras 4 ferramentas visíveis na navbar
  const mainTools = [
    { href: '/converter', name: 'PDF para Excel' },
    { href: '/ocr', name: 'PDF para Excel (OCR)' },
    { href: '/juntar', name: 'Juntar PDFs' },
    { href: '/dividir', name: 'Dividir PDF' },
  ]

  // Ferramentas extras no dropdown "Mais"
  const moreTools = [
    { href: '/comprimir', name: 'Comprimir PDF' },
    { href: '/tiff-to-pdf', name: 'TIFF para PDF' },
  ]

  // Ferramenta admin (só aparece se for admin)
  const adminTools = (session?.user as any)?.role === 'admin' 
    ? [{ href: '/tradutor-tecnico', name: 'Tradutor Técnico', adminOnly: true }]
    : []

  // Todas as ferramentas (para mobile)
  const allTools = [...mainTools, ...moreTools, ...adminTools]

  const isActive = (href: string) => pathname === href
  const isMoreActive = moreTools.some(tool => pathname === tool.href)

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
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {/* Ferramentas principais */}
            {mainTools.map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                className={`px-2 lg:px-3 py-2 rounded-lg transition-colors font-medium text-xs lg:text-sm ${
                  isActive(tool.href)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                {tool.name}
              </a>
            ))}

            {/* Dropdown "Mais" */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsMoreMenuOpen(true)}
                onMouseLeave={() => setIsMoreMenuOpen(false)}
                className={`px-2 lg:px-3 py-2 rounded-lg transition-colors font-medium text-xs lg:text-sm flex items-center gap-1 ${
                  isMoreActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                Mais
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isMoreMenuOpen && (
                <div
                  onMouseEnter={() => setIsMoreMenuOpen(true)}
                  onMouseLeave={() => setIsMoreMenuOpen(false)}
                  className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] z-50"
                >
                  {moreTools.map((tool) => (
                    <a
                      key={tool.href}
                      href={tool.href}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        isActive(tool.href)
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                      }`}
                    >
                      {tool.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Ferramenta Admin (Desktop) */}
            {(session?.user as any)?.role === 'admin' && (
              <a
                href="/tradutor-tecnico"
                className={`px-2 lg:px-3 py-2 rounded-lg transition-colors font-medium text-xs lg:text-sm flex items-center gap-1 ${
                  isActive('/tradutor-tecnico')
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-purple-700 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Tradutor
              </a>
            )}

            {/* Auth Menu (Desktop) */}
            <div className="ml-auto pl-4 flex items-center gap-2">
              {status === 'loading' ? (
                <div className="w-20 h-9 bg-gray-100 rounded-lg animate-pulse"></div>
              ) : session ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 200)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors"
                  >
                    <div className="w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {session.user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-800">{session.user?.name || session.user?.email}</p>
                        <p className="text-xs text-gray-500">{session.user?.email}</p>
                        {(session.user as any)?.role === 'admin' && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                            Admin
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <a
                    href="/auth/login"
                    className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Entrar
                  </a>
                  <a
                    href="/auth/register"
                    className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Cadastrar
                  </a>
                </>
              )}
            </div>
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
              {allTools.map((tool) => (
                <a
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 text-left transition-colors font-medium text-sm flex items-center gap-2 ${
                    isActive(tool.href)
                      ? ((tool as any).adminOnly ? 'bg-purple-50 text-purple-600' : 'bg-primary-50 text-primary-600')
                      : ((tool as any).adminOnly ? 'text-purple-700 hover:bg-purple-50' : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600')
                  }`}
                >
                  {(tool as any).adminOnly && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                  {tool.name}
                </a>
              ))}
              
              {/* Auth buttons mobile */}
              <div className="border-t border-gray-200 mt-2 pt-2 px-4">
                {session ? (
                  <>
                    <div className="py-2 text-sm text-gray-600">
                      <p className="font-medium">{session.user?.name || session.user?.email}</p>
                      {(session.user as any)?.role === 'admin' && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                          Admin
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        signOut({ callbackUrl: '/' })
                      }}
                      className="w-full mt-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <a
                      href="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-center text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      Entrar
                    </a>
                    <a
                      href="/auth/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-center bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Cadastrar
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
