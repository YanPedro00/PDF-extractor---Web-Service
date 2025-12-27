import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contato - PDFUtilities',
  description: 'Entre em contato com nossa equipe para dúvidas, sugestões ou suporte técnico. Estamos aqui para ajudar você com suas necessidades de PDF.',
  keywords: 'contato pdfutilities, suporte pdf, ajuda pdf',
}

export default function ContatoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

