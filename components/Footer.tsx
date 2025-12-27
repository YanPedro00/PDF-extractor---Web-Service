import Link from 'next/link'

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
            <Link href="/sobre" className="text-sm text-primary-600 hover:underline">
              Saiba mais →
            </Link>
          </div>

          {/* Ferramentas */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Ferramentas</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/converter" className="text-gray-600 hover:text-primary-600 transition-colors">
                  PDF para Excel
                </Link>
              </li>
              <li>
                <Link href="/ocr" className="text-gray-600 hover:text-primary-600 transition-colors">
                  PDF Escaneado (OCR)
                </Link>
              </li>
              <li>
                <Link href="/juntar" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Juntar PDFs
                </Link>
              </li>
              <li>
                <Link href="/dividir" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Dividir PDF
                </Link>
              </li>
              <li>
                <Link href="/comprimir" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Comprimir PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Suporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contato" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <a href="mailto:contato@pdfutilities.com" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Email: contato@pdfutilities.com
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacidade" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Termos de Uso
                </Link>
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

