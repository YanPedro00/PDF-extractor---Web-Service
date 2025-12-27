'use client'

import PDFCompressor from '@/components/PDFCompressor'
import Link from 'next/link'
import GoogleAd from '@/components/GoogleAd'
import { useState, useEffect } from 'react'

export default function ComprimirPage() {
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
              Comprimir PDF - Reduzir Tamanho de Arquivo
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed">
              Reduza o tamanho dos seus arquivos PDF sem perder qualidade significativa. Perfeito para enviar por email, 
              economizar espaço de armazenamento ou fazer upload em sites com limite de tamanho.
            </p>

            <div className="bg-primary-50 rounded-lg p-4 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                ✨ Quando usar esta ferramenta:
              </h2>
              <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Enviar por email:</strong> PDFs muito grandes podem ser rejeitados por servidores de email (limite geralmente 25MB)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Upload em formulários:</strong> Sites e sistemas online frequentemente têm limites de tamanho de arquivo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Economizar espaço:</strong> Libere espaço de armazenamento no seu computador ou nuvem</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Compartilhamento rápido:</strong> Arquivos menores são mais rápidos para transferir e baixar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Arquivamento:</strong> Comprima documentos antigos que precisam ser mantidos mas raramente acessados</span>
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
                    <strong>Faça upload do PDF:</strong> Selecione o arquivo PDF que deseja comprimir. 
                    A ferramenta mostrará o tamanho original do arquivo.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                  <div>
                    <strong>Escolha o nível de compressão:</strong>
                    <ul className="mt-2 space-y-1 ml-4">
                      <li>• <strong>Baixa Compressão (Alta Qualidade):</strong> ~15% de redução - Mantém máxima qualidade visual</li>
                      <li>• <strong>Compressão Recomendada (Balanceada):</strong> ~40% de redução - Boa qualidade e boa compressão</li>
                      <li>• <strong>Extrema Compressão (Máxima Redução):</strong> ~60% de redução - Prioriza menor tamanho</li>
                    </ul>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                  <div>
                    <strong>Comprima e baixe:</strong> Clique em &quot;Comprimir PDF&quot; e aguarde alguns segundos. 
                    O arquivo comprimido será baixado automaticamente.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">4</span>
                  <div>
                    <strong>Verifique o resultado:</strong> Compare o tamanho antes e depois. 
                    Se necessário, teste outro nível de compressão.
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                💡 Dicas para melhor compressão:
              </h2>
              <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">⚡</span>
                  <span><strong>PDFs com muitas imagens:</strong> Geralmente têm melhor taxa de compressão, podendo reduzir até 70-80%.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">⚡</span>
                  <span><strong>PDFs escaneados:</strong> Documentos escaneados em alta resolução são os que mais se beneficiam da compressão.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">⚡</span>
                  <span><strong>Teste primeiro:</strong> Use compressão média primeiro. Se o arquivo ainda for grande, tente alta compressão.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">⚡</span>
                  <span><strong>Verifique a qualidade:</strong> Sempre abra o PDF comprimido para verificar se a qualidade está aceitável.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">⚡</span>
                  <span><strong>PDFs já otimizados:</strong> Alguns PDFs já estão comprimidos - nesses casos a redução será menor.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">⚡</span>
                  <span><strong>Processamento local:</strong> Tudo acontece no seu navegador - seus arquivos não são enviados para nenhum servidor.</span>
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
          
          <PDFCompressor />

          {/* Seção de perguntas frequentes */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mt-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              ❓ Perguntas Frequentes
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Quanto posso reduzir o tamanho do meu PDF?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Depende do conteúdo do PDF. PDFs com muitas imagens em alta resolução podem ser reduzidos em 50-70%. 
                  PDFs com muito texto terão menor taxa de compressão (10-30%). Nossa ferramenta mostra a redução exata após o processo.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">A compressão afeta a qualidade do PDF?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  A compressão baixa mantém qualidade quase idêntica ao original. A média tem perda imperceptível para a maioria dos usos. 
                  A alta compressão pode ter leve perda de qualidade em imagens, mas o texto permanece nítido e legível.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Posso comprimir PDFs protegidos por senha?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Não. PDFs protegidos por senha precisam ser desbloqueados primeiro. Você pode usar ferramentas de 
                  remoção de senha do PDF antes de comprimir.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Posso descomprimir o PDF depois?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Não. A compressão de PDF remove dados permanentemente para reduzir o tamanho. Por isso, 
                  recomendamos sempre manter uma cópia do arquivo original antes de comprimir.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Qual nível de compressão devo escolher?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Para a maioria dos casos, recomendamos a <strong>Compressão Recomendada</strong> - oferece excelente redução de tamanho (40%) 
                  mantendo boa qualidade visual. Use <strong>Baixa Compressão</strong> para apresentações e documentos profissionais onde 
                  qualidade é essencial. Use <strong>Extrema Compressão</strong> quando você precisa do menor tamanho possível, como para 
                  limites de upload ou envio de muitos arquivos.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Há limite de tamanho de arquivo?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Como o processamento ocorre localmente no seu navegador, o limite depende da memória do seu dispositivo. 
                  Recomendamos até 50MB para melhor performance. Arquivos maiores podem levar mais tempo ou travar o navegador.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Meus dados estão seguros?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Sim! Todo o processamento acontece localmente no seu navegador. Seus arquivos nunca são enviados 
                  para nenhum servidor, garantindo total privacidade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

