import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dividir PDF - Extrair Páginas de PDF - PDFUtilities',
  description: 'Divida arquivos PDF em páginas separadas ou extraia páginas específicas gratuitamente. Ferramenta online para separar documentos PDF.',
  keywords: 'dividir pdf, separar pdf, extrair página pdf, split pdf, cortar pdf',
}

export default function DividirLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

