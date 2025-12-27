'use client'

import PDFMerger from '@/components/PDFMerger'
import Link from 'next/link'
import GoogleAd from '@/components/GoogleAd'
import { useState, useEffect } from 'react'

export default function JuntarPage() {
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
              Juntar PDFs - Mesclar Múltiplos Arquivos
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed">
              Combine múltiplos arquivos PDF em um único documento de forma rápida e fácil. 
              Perfeito para organizar documentos relacionados, criar relatórios completos ou preparar apresentações.
            </p>

            <div className="bg-primary-50 rounded-lg p-4 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                ✨ Casos de uso comuns:
              </h2>
              <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Documentos Acadêmicos:</strong> Combine capítulos de trabalhos, artigos e referências em um único PDF</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Contratos e Propostas:</strong> Una contratos, anexos e documentos complementares</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Relatórios Empresariais:</strong> Consolide relatórios de diferentes departamentos em um documento único</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Apresentações:</strong> Combine slides de diferentes apresentações em um único arquivo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Documentação Pessoal:</strong> Organize documentos pessoais como RG, CPF, comprovantes em um só lugar</span>
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
                    <strong>Adicione seus PDFs:</strong> Clique para selecionar ou arraste múltiplos arquivos PDF para a área de upload. 
                    Você pode adicionar quantos arquivos quiser.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                  <div>
                    <strong>Organize a ordem:</strong> Use as setas para cima ↑ e para baixo ↓ para reorganizar os arquivos na ordem desejada. 
                    A ordem que você definir será mantida no PDF final.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                  <div>
                    <strong>Remova arquivos (opcional):</strong> Clique no ✕ para remover qualquer arquivo que você não queira incluir.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">4</span>
                  <div>
                    <strong>Junte os PDFs:</strong> Clique no botão "Juntar PDFs" e aguarde alguns segundos. 
                    O download iniciará automaticamente.
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
                  <span><strong>Sem limite de arquivos:</strong> Junte quantos PDFs precisar, de 2 a centenas de documentos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">⚡</span>
                  <span><strong>Processamento local:</strong> Tudo acontece no seu navegador - seus arquivos não são enviados para nenhum servidor.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">⚡</span>
                  <span><strong>Preserva qualidade:</strong> A qualidade original dos PDFs é mantida, incluindo imagens e formatação.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">⚡</span>
                  <span><strong>Rápido e eficiente:</strong> O processo é instantâneo para a maioria dos documentos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">⚡</span>
                  <span><strong>A ordem importa:</strong> O primeiro arquivo da lista será o primeiro no PDF final, e assim por diante.</span>
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
          
          <PDFMerger />

          {/* Seção de perguntas frequentes */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mt-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              ❓ Perguntas Frequentes
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Quantos PDFs posso juntar de uma vez?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Não há limite técnico, mas recomendamos até 50 arquivos por vez para melhor performance. 
                  Para mais arquivos, você pode fazer em lotes e depois juntar os resultados.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Os PDFs precisam ter o mesmo tamanho?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Não! Você pode juntar PDFs de diferentes tamanhos (A4, carta, etc.). Cada página manterá seu tamanho original.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">A ferramenta mantém links e marcadores?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Sim, links internos e marcadores (bookmarks) são preservados quando possível. No entanto, links entre diferentes PDFs podem não funcionar após a mesclagem.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Posso adicionar o mesmo arquivo mais de uma vez?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Sim! Você pode adicionar o mesmo PDF múltiplas vezes se precisar que ele apareça em diferentes posições do documento final.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">O arquivo final fica muito grande?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  O tamanho do PDF final será aproximadamente a soma dos arquivos individuais. A ferramenta não comprime os PDFs, mantendo a qualidade original.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
