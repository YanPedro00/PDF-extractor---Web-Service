import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Escaneado para Excel com OCR - PDFUtilities',
  description: 'Converta PDFs escaneados para Excel usando tecnologia OCR avançada. Ideal para digitalizar documentos, faturas e notas fiscais fotografadas.',
  keywords: 'ocr pdf excel, pdf escaneado para excel, converter imagem para excel, ocr online, digitalizar documento',
}

export default function OCRLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

