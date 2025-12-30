
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto px-3 sm:px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Sobre */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">PDFUtilities</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Ferramentas online gratuitas para converter, juntar e dividir arquivos PDF. 
              Simples, rápido e seguro.
            </p>
            <a href="/sobre" className="text-sm text-primary-600 hover:underline">
              Saiba mais →
            </a>
          </div>

          {/* Ferramentas */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Ferramentas</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/converter" className="text-gray-600 hover:text-primary-600 transition-colors">
                  PDF para Excel
                </a>
              </li>
              <li>
                <a href="/ocr" className="text-gray-600 hover:text-primary-600 transition-colors">
                  PDF Escaneado (OCR)
                </a>
              </li>
              <li>
                <a href="/juntar" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Juntar PDFs
                </a>
              </li>
              <li>
                <a href="/dividir" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Dividir PDF
                </a>
              </li>
              <li>
                <a href="/comprimir" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Comprimir PDF
                </a>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Suporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/contato" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <a href="/sobre" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="mailto:pdf.utilities00@gmail.com" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Email: pdf.utilities00@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/privacidade" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="/termos" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 text-center sm:text-left">
            © {currentYear} PDFUtilities. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>🇧🇷 Feito com ❤️ no Brasil</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

