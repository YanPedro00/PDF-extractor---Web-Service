import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Nós - PDFUtilities',
  description: 'Conheça o PDFUtilities, plataforma gratuita de ferramentas online para converter, juntar e dividir PDFs com tecnologia de ponta e total privacidade.',
  keywords: 'sobre pdfutilities, ferramentas pdf, converter pdf online',
}

export default function SobreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

