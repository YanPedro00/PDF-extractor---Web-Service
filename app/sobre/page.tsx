import Link from 'next/link'

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="mb-4 sm:mb-6 text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 text-sm sm:text-base inline-flex"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </Link>

          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
              Sobre o PDFUtilities
            </h1>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
                  Nossa Missão
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  O PDFUtilities nasceu com o objetivo de democratizar o acesso a ferramentas profissionais de manipulação 
                  de documentos PDF. Acreditamos que todos devem ter acesso a ferramentas de qualidade para trabalhar com 
                  seus documentos, sem custos, sem complicações e com total privacidade.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
                  O Que Oferecemos
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Desenvolvemos uma suite completa de ferramentas online gratuitas para trabalhar com PDFs:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-primary-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">📄 Conversão para Excel</h3>
                    <p className="text-sm text-gray-600">
                      Converta PDFs com texto selecionável em planilhas Excel editáveis, perfeito para faturas e relatórios.
                    </p>
                  </div>
                  <div className="bg-primary-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">👁️ OCR Avançado</h3>
                    <p className="text-sm text-gray-600">
                      Tecnologia de reconhecimento óptico de caracteres para converter documentos escaneados em dados editáveis.
                    </p>
                  </div>
                  <div className="bg-primary-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">🔗 Juntar PDFs</h3>
                    <p className="text-sm text-gray-600">
                      Combine múltiplos arquivos PDF em um único documento, mantendo a qualidade original.
                    </p>
                  </div>
                  <div className="bg-primary-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">✂️ Dividir PDFs</h3>
                    <p className="text-sm text-gray-600">
                      Extraia páginas específicas ou divida documentos grandes em arquivos menores.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
                  Por Que Escolher o PDFUtilities?
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">100% Gratuito</h3>
                      <p className="text-gray-600 text-sm">
                        Todas as nossas ferramentas são completamente gratuitas, sem taxas ocultas ou limites de uso artificiais.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Privacidade em Primeiro Lugar</h3>
                      <p className="text-gray-600 text-sm">
                        Seus arquivos são processados de forma segura e temporária. Quando possível, o processamento ocorre 
                        localmente no seu navegador, sem enviar dados para servidores.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Tecnologia de Ponta</h3>
                      <p className="text-gray-600 text-sm">
                        Utilizamos as melhores bibliotecas e algoritmos disponíveis para garantir resultados precisos e de alta qualidade.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Interface Intuitiva</h3>
                      <p className="text-gray-600 text-sm">
                        Design limpo e moderno que funciona perfeitamente em qualquer dispositivo - desktop, tablet ou celular.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Sem Instalação</h3>
                      <p className="text-gray-600 text-sm">
                        Tudo funciona direto no navegador. Não é necessário instalar programas ou criar contas.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
                  Nossa Tecnologia
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  O PDFUtilities é construído com tecnologias modernas e confiáveis:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>PaddleOCR:</strong> Tecnologia de OCR de última geração para reconhecimento de texto em imagens</li>
                  <li><strong>img2table:</strong> Biblioteca especializada em extração de tabelas de documentos</li>
                  <li><strong>PDF.js:</strong> Renderização e manipulação de PDFs diretamente no navegador</li>
                  <li><strong>Next.js & React:</strong> Framework moderno para uma experiência de usuário rápida e responsiva</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
                  Quem Usa o PDFUtilities?
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Nossas ferramentas são usadas por diversos profissionais e casos de uso:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    <span className="text-gray-700">Contadores processando faturas e notas fiscais</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    <span className="text-gray-700">Estudantes organizando trabalhos acadêmicos</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    <span className="text-gray-700">Empresas digitalizando documentos antigos</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    <span className="text-gray-700">Profissionais consolidando relatórios</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    <span className="text-gray-700">Freelancers gerenciando contratos</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    <span className="text-gray-700">Pessoas organizando documentos pessoais</span>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
                  Compromisso com a Qualidade
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Estamos constantemente melhorando nossas ferramentas baseando-nos no feedback dos usuários e nas últimas 
                  inovações tecnológicas. Nosso objetivo é fornecer a melhor experiência possível, mantendo a simplicidade 
                  e a eficiência que nos definem.
                </p>
              </section>

              <section className="bg-primary-50 rounded-lg p-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
                  Entre em Contato
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tem sugestões, feedback ou precisa de ajuda? Adoraríamos ouvir você! 
                </p>
                <Link 
                  href="/contato"
                  className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Fale Conosco
                </Link>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

