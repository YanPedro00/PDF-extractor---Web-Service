import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comprimir PDF - Reduzir Tamanho Online - PDFUtilities',
  description: 'Comprima arquivos PDF online gratuitamente. Reduza o tamanho do PDF mantendo a qualidade. Ideal para enviar por email e economizar espaço.',
  keywords: 'comprimir pdf, reduzir pdf, diminuir tamanho pdf, otimizar pdf, compress pdf online',
}

export default function ComprimirLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

