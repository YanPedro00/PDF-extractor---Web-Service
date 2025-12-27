import Link from 'next/link'

export default function TermosPage() {
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
              Termos de Uso
            </h1>
            <p className="text-sm text-gray-500 mb-8">
              Última atualização: Dezembro de 2025
            </p>

            <div className="prose prose-sm sm:prose max-w-none space-y-6">
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">1. Aceitação dos Termos</h2>
                <p className="text-gray-700 leading-relaxed">
                  Ao acessar e usar o PDFUtilities (&quot;Site&quot;), você concorda em cumprir e estar vinculado aos seguintes 
                  Termos de Uso. Se você não concorda com qualquer parte destes termos, não deve usar nosso Site.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">2. Descrição do Serviço</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  O PDFUtilities fornece ferramentas online gratuitas para:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Converter PDFs para Excel (com texto selecionável)</li>
                  <li>Converter PDFs escaneados para Excel usando OCR</li>
                  <li>Juntar múltiplos arquivos PDF</li>
                  <li>Dividir PDFs em páginas individuais ou extrair páginas específicas</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">3. Uso Aceitável</h2>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">3.1 Você Concorda em:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Usar o Site apenas para fins legais e legítimos</li>
                  <li>Não fazer upload de arquivos que contenham vírus, malware ou código malicioso</li>
                  <li>Não usar o Site de forma que possa danificar, desabilitar ou prejudicar o serviço</li>
                  <li>Não tentar obter acesso não autorizado ao Site ou seus sistemas</li>
                  <li>Respeitar os direitos de propriedade intelectual de terceiros</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">3.2 Você Não Pode:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Fazer upload de conteúdo ilegal, difamatório, obsceno ou ofensivo</li>
                  <li>Usar o Site para fins comerciais sem nossa autorização expressa</li>
                  <li>Reproduzir, duplicar, copiar ou revender qualquer parte do Site</li>
                  <li>Usar ferramentas automatizadas (bots, scrapers) sem permissão</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">4. Conteúdo do Usuário</h2>
                <p className="text-gray-700 leading-relaxed">
                  Você mantém todos os direitos sobre os arquivos que você carrega. Ao usar nosso serviço, você nos concede 
                  uma licença temporária para processar seus arquivos com o único propósito de fornecer o serviço solicitado. 
                  Seus arquivos são automaticamente deletados após o processamento.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Você é o único responsável pelo conteúdo que carrega e deve garantir que possui todos os direitos necessários 
                  para usar e processar esses arquivos.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">5. Propriedade Intelectual</h2>
                <p className="text-gray-700 leading-relaxed">
                  O Site e todo o seu conteúdo, recursos e funcionalidades (incluindo, mas não limitado a, informações, 
                  software, texto, exibições, imagens e design) são propriedade do PDFUtilities e estão protegidos por 
                  leis internacionais de direitos autorais, marcas registradas e outras leis de propriedade intelectual.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">6. Isenção de Garantias</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  O Site é fornecido &quot;COMO ESTÁ&quot; e &quot;CONFORME DISPONÍVEL&quot; sem garantias de qualquer tipo, expressas ou implícitas, incluindo, mas não limitado a:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Garantias de comercialização ou adequação a um propósito específico</li>
                  <li>Garantia de que o serviço será ininterrupto, pontual ou livre de erros</li>
                  <li>Garantia sobre a precisão ou confiabilidade dos resultados obtidos</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Recomendamos sempre verificar os resultados das conversões antes de usar para fins importantes.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">7. Limitação de Responsabilidade</h2>
                <p className="text-gray-700 leading-relaxed">
                  Em nenhuma circunstância o PDFUtilities, seus diretores, funcionários ou afiliados serão responsáveis por 
                  quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo, mas não 
                  limitado a, perda de lucros, dados, uso, boa vontade ou outras perdas intangíveis resultantes de:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                  <li>Seu acesso ou uso (ou incapacidade de acessar ou usar) do Site</li>
                  <li>Qualquer conduta ou conteúdo de terceiros no Site</li>
                  <li>Qualquer conteúdo obtido do Site</li>
                  <li>Acesso não autorizado, uso ou alteração de suas transmissões ou conteúdo</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">8. Precisão das Conversões</h2>
                <p className="text-gray-700 leading-relaxed">
                  Embora nos esforcemos para fornecer conversões precisas, a qualidade dos resultados pode variar dependendo de:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                  <li>Qualidade e formato do PDF original</li>
                  <li>Complexidade da estrutura do documento</li>
                  <li>Legibilidade de documentos escaneados</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Você é responsável por verificar a precisão dos resultados antes de usá-los.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">9. Links para Sites de Terceiros</h2>
                <p className="text-gray-700 leading-relaxed">
                  Nosso Site pode conter links para sites de terceiros ou serviços que não são de propriedade ou controlados 
                  pelo PDFUtilities. Não assumimos responsabilidade pelo conteúdo, políticas de privacidade ou práticas de 
                  sites ou serviços de terceiros.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">10. Anúncios</h2>
                <p className="text-gray-700 leading-relaxed">
                  O Site exibe anúncios através do Google AdSense. Não somos responsáveis pelo conteúdo dos anúncios exibidos. 
                  Clique nos anúncios por sua própria conta e risco.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">11. Modificações do Serviço</h2>
                <p className="text-gray-700 leading-relaxed">
                  Reservamo-nos o direito de modificar ou descontinuar, temporária ou permanentemente, o Site (ou qualquer parte dele) 
                  com ou sem aviso prévio. Não seremos responsáveis perante você ou terceiros por qualquer modificação, 
                  suspensão ou descontinuação do Site.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">12. Lei Aplicável</h2>
                <p className="text-gray-700 leading-relaxed">
                  Estes Termos serão regidos e interpretados de acordo com as leis do Brasil, sem considerar suas 
                  disposições sobre conflito de leis.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">13. Alterações aos Termos</h2>
                <p className="text-gray-700 leading-relaxed">
                  Reservamo-nos o direito de modificar estes Termos a qualquer momento. Publicaremos quaisquer alterações 
                  nesta página e atualizaremos a data da &quot;Última atualização&quot; no topo. Seu uso continuado do Site após 
                  tais modificações constitui sua aceitação dos novos Termos.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">14. Contato</h2>
                <p className="text-gray-700 leading-relaxed">
                  Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através da 
                  nossa <Link href="/contato" className="text-primary-600 hover:underline">página de contato</Link>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

