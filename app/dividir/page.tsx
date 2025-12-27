'use client'

import PDFSplitter from '@/components/PDFSplitter'
import Link from 'next/link'
import GoogleAd from '@/components/GoogleAd'
import { useState, useEffect } from 'react'

export default function DividirPage() {
  const [contentReady, setContentReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setContentReady(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="mb-4 sm:mb-6 text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 text-sm sm:text-base inline-flex"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </Link>

          {/* Descrição da ferramenta */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Dividir PDF - Extrair Páginas Específicas
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed">
              Divida arquivos PDF grandes em páginas individuais ou extraia apenas as páginas que você precisa. 
              Perfeito para separar documentos, compartilhar páginas específicas ou organizar arquivos.
            </p>

            <div className="bg-primary-50 rounded-lg p-4 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                ✨ Quando usar esta ferramenta:
              </h2>
              <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Extrair páginas específicas:</strong> Pegue apenas as páginas que você precisa de um documento grande</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Separar capítulos:</strong> Divida livros ou manuais em capítulos individuais</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Compartilhar documentos:</strong> Extraia páginas específicas para compartilhar sem enviar o arquivo completo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Organizar arquivos:</strong> Separe faturas, contratos ou relatórios em arquivos individuais</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Reduzir tamanho:</strong> Crie arquivos menores extraindo apenas as páginas necessárias</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                📋 Como usar:
              </h2>
              <ol className="space-y-3 text-sm sm:text-base text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
                  <div>
                    <strong>Faça upload do PDF:</strong> Clique para selecionar ou arraste seu arquivo PDF para a área de upload. 
                    A ferramenta mostrará quantas páginas o documento possui.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                  <div>
                    <strong>Escolha o modo de divisão:</strong>
                    <ul className="mt-2 space-y-1 ml-4">
                      <li>• <strong>Extrair todas as páginas:</strong> Cada página vira um PDF separado</li>
                      <li>• <strong>Selecionar páginas:</strong> Escolha manualmente quais páginas extrair</li>
                    </ul>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                  <div>
                    <strong>Selecione as páginas (modo seleção):</strong> Clique nos números das páginas que deseja extrair. 
                    Páginas selecionadas ficam destacadas em azul. Use "Selecionar todas" para marcar todas de uma vez.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">4</span>
                  <div>
                    <strong>Extrair páginas:</strong> Clique no botão para processar. Se você selecionou múltiplas páginas, 
                    um arquivo ZIP será baixado contendo todos os PDFs individuais.
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                💡 Dicas e recursos:
              </h2>
              <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">⚡</span>
                  <span><strong>Modo flexível:</strong> Extraia todas as páginas de uma vez ou escolha apenas as que precisa.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">⚡</span>
                  <span><strong>Seleção múltipla:</strong> Clique em quantas páginas quiser - não há limite.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">⚡</span>
                  <span><strong>Preserva qualidade:</strong> As páginas extraídas mantêm a mesma qualidade do PDF original.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">⚡</span>
                  <span><strong>Download em ZIP:</strong> Múltiplas páginas são automaticamente compactadas em um arquivo ZIP.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">⚡</span>
                  <span><strong>Nomes automáticos:</strong> Cada PDF extraído é nomeado com o número da página original (ex: pagina_1.pdf).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">⚡</span>
                  <span><strong>Processamento local:</strong> Tudo acontece no seu navegador - máxima privacidade e segurança.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Google Ad */}
          {contentReady && (
            <div className="mb-6 flex justify-center">
              <GoogleAd 
                adSlot={process.env.NEXT_PUBLIC_GOOGLE_ADS_SLOT_1 || '6280286471'} 
                adFormat="auto"
                className="min-h-[100px] w-full max-w-[728px]"
                shouldRender={contentReady}
              />
            </div>
          )}
          
          <PDFSplitter />

          {/* Seção de perguntas frequentes */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mt-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              ❓ Perguntas Frequentes
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Posso extrair páginas não sequenciais?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Sim! No modo "Selecionar páginas", você pode escolher qualquer combinação de páginas. 
                  Por exemplo, você pode extrair as páginas 1, 5, 7 e 12 do mesmo documento.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Como recebo as páginas extraídas?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Se você extrair apenas uma página, receberá um arquivo PDF. Se extrair múltiplas páginas, 
                  receberá um arquivo ZIP contendo todos os PDFs individuais nomeados sequencialmente.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Há limite de páginas no PDF?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Não há limite técnico, mas PDFs muito grandes (centenas de páginas) podem levar mais tempo para processar. 
                  A ferramenta funciona melhor com documentos de até 200 páginas.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">A extração afeta a qualidade?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Não! As páginas extraídas são cópias exatas das originais, mantendo 100% da qualidade, 
                  incluindo textos, imagens, links e formatação.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Posso dividir PDFs protegidos por senha?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  A ferramenta funciona apenas com PDFs desprotegidos. Se seu PDF tem senha, 
                  você precisará desbloqueá-lo primeiro usando outra ferramenta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
