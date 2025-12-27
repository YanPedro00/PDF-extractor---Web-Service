import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Converter PDF para Excel - PDFUtilities',
  description: 'Converta PDFs com texto selecionável para planilhas Excel. Ferramenta gratuita para extrair tabelas de faturas, notas fiscais e relatórios em PDF.',
  keywords: 'converter pdf para excel, pdf para excel, extrair tabela pdf, pdf to excel, converter fatura pdf',
}

export default function ConverterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

