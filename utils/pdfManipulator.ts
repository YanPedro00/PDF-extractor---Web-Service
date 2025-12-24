import { PDFDocument } from 'pdf-lib'
import { saveAs } from 'file-saver'

/**
 * Junta múltiplos PDFs em um único arquivo
 */
export async function mergePDFs(
  files: File[],
  onProgress?: (progress: number) => void
): Promise<void> {
  try {
    onProgress?.(10)

    const mergedPdf = await PDFDocument.create()

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)

      // Copiar todas as páginas do PDF atual para o PDF mesclado
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      pages.forEach((page) => mergedPdf.addPage(page))

      onProgress?.(10 + ((i + 1) / files.length) * 80)
    }

    onProgress?.(90)

    // Gerar PDF mesclado
    const pdfBytes = await mergedPdf.save()

    onProgress?.(95)

    // Salvar arquivo - converter Uint8Array para ArrayBuffer se necessário
    const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
    const fileName = `PDFs_Mesclados_${new Date().getTime()}.pdf`
    saveAs(blob, fileName)

    onProgress?.(100)
  } catch (error) {
    console.error('Erro ao mesclar PDFs:', error)
    throw new Error('Erro ao mesclar PDFs. Verifique se os arquivos estão corretos.')
  }
}

/**
 * Extrai todas as páginas de um PDF como arquivos separados
 */
export async function splitPDFAllPages(
  file: File,
  onProgress?: (progress: number) => void
): Promise<void> {
  try {
    onProgress?.(10)

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const numPages = pdf.getPageCount()

    onProgress?.(20)

    // Criar um ZIP com todas as páginas (ou salvar individualmente)
    for (let i = 0; i < numPages; i++) {
      const newPdf = await PDFDocument.create()
      const [copiedPage] = await newPdf.copyPages(pdf, [i])
      newPdf.addPage(copiedPage)

      const pdfBytes = await newPdf.save()
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
      const fileName = file.name.replace('.pdf', `_pagina_${i + 1}.pdf`)
      saveAs(blob, fileName)

      onProgress?.(20 + ((i + 1) / numPages) * 70)
    }

    onProgress?.(100)
  } catch (error) {
    console.error('Erro ao dividir PDF:', error)
    throw new Error('Erro ao dividir PDF. Verifique se o arquivo está correto.')
  }
}

/**
 * Extrai páginas específicas de um PDF (cada página como arquivo separado)
 */
export async function splitPDFSelectedPages(
  file: File,
  selectedPages: number[],
  onProgress?: (progress: number) => void
): Promise<void> {
  try {
    onProgress?.(10)

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const numPages = pdf.getPageCount()

    // Validar páginas selecionadas
    const validPages = selectedPages
      .filter((page) => page >= 1 && page <= numPages)
      .map((page) => page - 1) // Converter para índice baseado em 0

    if (validPages.length === 0) {
      throw new Error('Nenhuma página válida selecionada')
    }

    onProgress?.(20)

    // Criar um PDF separado para cada página selecionada
    for (let i = 0; i < validPages.length; i++) {
      const pageIndex = validPages[i]
      const newPdf = await PDFDocument.create()
      const [copiedPage] = await newPdf.copyPages(pdf, [pageIndex])
      newPdf.addPage(copiedPage)

      const pdfBytes = await newPdf.save()
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
      const pageNum = pageIndex + 1
      const fileName = file.name.replace('.pdf', `_pagina_${pageNum}.pdf`)
      saveAs(blob, fileName)

      onProgress?.(20 + ((i + 1) / validPages.length) * 70)
    }

    onProgress?.(100)
  } catch (error) {
    console.error('Erro ao extrair páginas do PDF:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Erro ao extrair páginas do PDF.'
    )
  }
}

/**
 * Obtém o número de páginas de um PDF
 */
export async function getPDFPageCount(file: File): Promise<number> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    return pdf.getPageCount()
  } catch (error) {
    console.error('Erro ao ler PDF:', error)
    throw new Error('Erro ao ler PDF. Verifique se o arquivo está correto.')
  }
}

