import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso - PDFUtilities',
  description: 'Leia nossos Termos de Uso e entenda as regras para utilização das ferramentas online gratuitas de PDF do PDFUtilities.',
  keywords: 'termos de uso, condições de uso, regulamento pdfutilities',
}

export default function TermosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

