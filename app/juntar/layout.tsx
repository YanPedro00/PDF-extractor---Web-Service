import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Juntar PDFs - Mesclar Arquivos PDF Online - PDFUtilities',
  description: 'Junte múltiplos arquivos PDF em um único documento gratuitamente. Combine PDFs, organize contratos, relatórios e apresentações online.',
  keywords: 'juntar pdf, mesclar pdf, combinar pdf, unir pdf, merge pdf online',
}

export default function JuntarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

