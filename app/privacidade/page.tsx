import Link from 'next/link'

export default function PrivacidadePage() {
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
              Política de Privacidade
            </h1>
            <p className="text-sm text-gray-500 mb-8">
              Última atualização: Dezembro de 2025
            </p>

            <div className="prose prose-sm sm:prose max-w-none space-y-6">
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">1. Introdução</h2>
                <p className="text-gray-700 leading-relaxed">
                  O PDFUtilities (&quot;nós&quot;, &quot;nosso&quot; ou &quot;nos&quot;) está comprometido em proteger sua privacidade. 
                  Esta Política de Privacidade explica como coletamos, usamos e protegemos suas informações quando você 
                  utiliza nosso site e ferramentas.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">2. Informações que Coletamos</h2>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">2.1 Informações Fornecidas por Você</h3>
                <p className="text-gray-700 leading-relaxed">
                  Ao usar nossas ferramentas de conversão e manipulação de PDF, você pode enviar arquivos PDF temporariamente. 
                  Estes arquivos são processados para fornecer o serviço solicitado e são automaticamente deletados após o processamento.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">2.2 Informações Coletadas Automaticamente</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Endereço IP</li>
                  <li>Tipo de navegador e dispositivo</li>
                  <li>Páginas visitadas e tempo de permanência</li>
                  <li>Informações de uso através de cookies e tecnologias similares</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">3. Como Usamos Suas Informações</h2>
                <p className="text-gray-700 leading-relaxed mb-3">Utilizamos as informações coletadas para:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Fornecer e melhorar nossos serviços</li>
                  <li>Processar suas solicitações de conversão de documentos</li>
                  <li>Analisar o uso do site e melhorar a experiência do usuário</li>
                  <li>Exibir anúncios relevantes através do Google AdSense</li>
                  <li>Detectar e prevenir fraudes e abusos</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">4. Processamento de Arquivos</h2>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Importante:</strong> Seus arquivos PDF são processados de forma temporária para fornecer o serviço de conversão. 
                  Dependendo da ferramenta utilizada:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                  <li>
                    <strong>Juntar e Dividir PDFs:</strong> O processamento ocorre localmente no seu navegador. 
                    Seus arquivos nunca são enviados para nossos servidores.
                  </li>
                  <li>
                    <strong>Conversão para Excel (OCR):</strong> Os arquivos são enviados para nosso servidor para processamento OCR 
                    e são automaticamente deletados após a conversão, sem armazenamento permanente.
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Não armazenamos, compartilhamos ou acessamos o conteúdo dos seus documentos além do necessário para o processamento.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">5. Cookies e Tecnologias de Rastreamento</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Utilizamos cookies e tecnologias similares para:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Melhorar a funcionalidade do site</li>
                  <li>Analisar o tráfego e comportamento do usuário</li>
                  <li>Personalizar anúncios através do Google AdSense</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">6. Google AdSense</h2>
                <p className="text-gray-700 leading-relaxed">
                  Utilizamos o Google AdSense para exibir anúncios. O Google pode usar cookies e tecnologias similares para 
                  personalizar anúncios com base no seu histórico de navegação. Você pode optar por não receber anúncios 
                  personalizados visitando as <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Configurações de Anúncios do Google</a>.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">7. Compartilhamento de Informações</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Não vendemos suas informações pessoais. Podemos compartilhar informações com:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Provedores de Serviços:</strong> Como Google AdSense para exibição de anúncios</li>
                  <li><strong>Conformidade Legal:</strong> Quando exigido por lei ou para proteger nossos direitos</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">8. Segurança</h2>
                <p className="text-gray-700 leading-relaxed">
                  Implementamos medidas de segurança apropriadas para proteger suas informações contra acesso não autorizado, 
                  alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela internet é 100% seguro.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">9. Seus Direitos</h2>
                <p className="text-gray-700 leading-relaxed mb-3">Você tem o direito de:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Acessar suas informações pessoais</li>
                  <li>Solicitar correção ou exclusão de suas informações</li>
                  <li>Optar por não receber comunicações de marketing</li>
                  <li>Gerenciar preferências de cookies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">10. Privacidade de Crianças</h2>
                <p className="text-gray-700 leading-relaxed">
                  Nosso serviço não é direcionado a menores de 13 anos. Não coletamos intencionalmente informações 
                  pessoais de crianças menores de 13 anos.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">11. Alterações a Esta Política</h2>
                <p className="text-gray-700 leading-relaxed">
                  Podemos atualizar esta Política de Privacidade periodicamente. A data da última atualização será 
                  sempre indicada no topo da página. Recomendamos que você revise esta política regularmente.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">12. Contato</h2>
                <p className="text-gray-700 leading-relaxed">
                  Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco através da 
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

