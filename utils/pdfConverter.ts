import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import * as pdfjsLib from 'pdfjs-dist'
import { createWorker } from 'tesseract.js'

// Configurar o worker do PDF.js
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
}

/**
 * Converte PDF com texto selecionável para Excel
 */
export async function convertPDFToExcel(
  file: File,
  onProgress?: (progress: number) => void
): Promise<void> {
  try {
    onProgress?.(10)

    const arrayBuffer = await file.arrayBuffer()
    onProgress?.(20)

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const numPages = pdf.numPages
    onProgress?.(30)

    const allText: string[][] = []
    const headers: string[] = []

    // Processar cada página
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()

      const pageText: string[] = []
      let currentLine = ''

      textContent.items.forEach((item: any) => {
        if (item.str) {
          currentLine += item.str + ' '
        }
        // Detectar quebra de linha baseado na posição Y
        if (item.hasEOL || item.str === '\n') {
          if (currentLine.trim()) {
            pageText.push(currentLine.trim())
            currentLine = ''
          }
        }
      })

      if (currentLine.trim()) {
        pageText.push(currentLine.trim())
      }

      // Se for a primeira página, tentar identificar cabeçalhos
      if (pageNum === 1 && pageText.length > 0) {
        // Assumir que a primeira linha pode ser cabeçalho
        const firstLine = pageText[0]
        headers.push(...firstLine.split(/\s{2,}|\t/).filter(h => h.trim()))
      }

      allText.push(...pageText.map(line => {
        // Tentar dividir por múltiplos espaços ou tabs
        const columns = line.split(/\s{2,}|\t/).filter(col => col.trim())
        return columns.length > 0 ? columns : [line]
      }))

      onProgress?.(30 + (pageNum / numPages) * 50)
    }

    onProgress?.(85)

    // Criar estrutura de dados para Excel
    const worksheetData: any[][] = []

    // Adicionar cabeçalhos se encontrados
    if (headers.length > 0) {
      worksheetData.push(headers)
    }

    // Adicionar dados
    allText.forEach(row => {
      if (Array.isArray(row) && row.length > 0) {
        worksheetData.push(row)
      }
    })

    // Criar workbook e worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

    // Ajustar largura das colunas
    const colWidths = worksheetData[0]?.map((_, colIndex) => {
      const maxLength = Math.max(
        ...worksheetData.map(row => {
          const cellValue = row[colIndex]?.toString() || ''
          return cellValue.length
        })
      )
      return { wch: Math.min(maxLength + 2, 50) }
    }) || []

    worksheet['!cols'] = colWidths

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados do PDF')

    onProgress?.(95)

    // Gerar arquivo Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const fileName = file.name.replace('.pdf', '.xlsx')
    saveAs(blob, fileName)

    onProgress?.(100)
  } catch (error) {
    console.error('Erro ao converter PDF:', error)
    throw new Error('Erro ao processar o PDF. Verifique se o arquivo está correto.')
  }
}

/**
 * Divide uma linha de texto em colunas baseado em separadores comuns
 */
function splitLineIntoColumns(line: string): string[] {
  // Remover espaços no início e fim
  const trimmed = line.trim()
  if (!trimmed) return []
  
  // Tentar diferentes estratégias de divisão
  
  // 1. Dividir por pipes (|) - comum em tabelas
  if (trimmed.includes('|')) {
    const parts = trimmed.split('|').map(p => p.trim()).filter(p => p)
    if (parts.length > 1) return parts
  }
  
  // 2. Dividir por tabs
  if (trimmed.includes('\t')) {
    const parts = trimmed.split('\t').map(p => p.trim()).filter(p => p)
    if (parts.length > 1) return parts
  }
  
  // 3. Dividir por múltiplos espaços (2 ou mais)
  const parts = trimmed.split(/\s{2,}/).map(p => p.trim()).filter(p => p)
  if (parts.length > 1) return parts
  
  // 4. Se não encontrou separadores, retornar a linha inteira
  return [trimmed]
}

/**
 * Converte PDF escaneado usando OCR para Excel
 * Tenta usar API Python (img2table + PaddleOCR) primeiro, fallback para Tesseract.js
 * PaddleOCR é 2-3x mais rápido e usa menos memória que EasyOCR
 */
export async function convertPDFWithOCR(
  file: File,
  onProgress?: (progress: number) => void
): Promise<void> {
  try {
    onProgress?.(5)

    // Tentar usar API Python primeiro (img2table + PaddleOCR)
    // PaddleOCR é mais rápido e eficiente que EasyOCR
    let apiUrl = process.env.NEXT_PUBLIC_OCR_API_URL || 'http://localhost:5003'
    
    // Garantir que a URL tenha protocolo
    if (apiUrl && !apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
      apiUrl = `https://${apiUrl}`
    }
    
    try {
      onProgress?.(10)
      
      // Verificar se API está disponível
      const healthCheck = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000), // Timeout de 3 segundos
      })

      if (healthCheck.ok) {
        // API disponível, usar img2table + PaddleOCR
        // PaddleOCR oferece melhor performance e precisão para tabelas
        onProgress?.(20)

        const formData = new FormData()
        formData.append('file', file)

        // Criar AbortController para timeout de 15 minutos (900000ms)
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15 * 60 * 1000) // 15 minutos

        try {
          const response = await fetch(`${apiUrl}/process-pdf`, {
            method: 'POST',
            body: formData,
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          if (!response.ok) {
            // Tentar ler erro da resposta
            let errorMessage = 'Erro na API de OCR'
            try {
              const errorData = await response.json()
              errorMessage = errorData.error || errorMessage
            } catch (e) {
              // Se não conseguir ler JSON, usar status
              if (response.status === 499) {
                errorMessage = 'Timeout: O processamento está demorando muito. Tente com um PDF menor ou divida o arquivo.'
              } else if (response.status === 502) {
                errorMessage = 'Erro no servidor: A API não conseguiu processar o arquivo. Tente novamente.'
              } else {
                errorMessage = `Erro ${response.status}: ${response.statusText}`
              }
            }
            throw new Error(errorMessage)
          }

          const result = await response.json()

          if (result.success && result.excel_base64) {
            onProgress?.(90)

          // Converter base64 para blob
          const binaryString = atob(result.excel_base64)
          const bytes = new Uint8Array(binaryString.length)
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }

          const blob = new Blob([bytes], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          })

            const fileName = result.filename || file.name.replace('.pdf', '_OCR.xlsx')
            saveAs(blob, fileName)

            onProgress?.(100)
            return
          }
        } catch (fetchError: any) {
          clearTimeout(timeoutId)
          
          // Se foi timeout, lançar erro específico
          if (fetchError.name === 'AbortError' || controller.signal.aborted) {
            throw new Error('Timeout: O processamento está demorando mais de 15 minutos. Tente com um PDF menor ou divida o arquivo em partes.')
          }
          
          // Re-lançar outros erros
          throw fetchError
        }
      }
    } catch (apiError: any) {
      // Se API não estiver disponível ou der erro, usar fallback Tesseract.js
      console.warn('API Python não disponível, usando Tesseract.js:', apiError)
      
      // Se foi erro de timeout, não usar fallback (já lançou erro acima)
      if (apiError.message && apiError.message.includes('Timeout')) {
        throw apiError
      }
    }

    // Fallback: usar Tesseract.js (implementação anterior)
    onProgress?.(10)

    // Inicializar worker do Tesseract
    const worker = await createWorker('por', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          const progressValue = Math.min(85, 10 + m.progress * 75)
          onProgress?.(progressValue)
        }
      },
    })

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const numPages = pdf.numPages

    const allText: string[][] = []
    const headers: string[] = []

    // Processar cada página
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: 2.0 })

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Não foi possível criar contexto do canvas')

      canvas.height = viewport.height
      canvas.width = viewport.width

      context.imageSmoothingEnabled = true
      context.imageSmoothingQuality = 'high'

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise

      const imageData = canvas.toDataURL('image/png')
      const { data: { text } } = await worker.recognize(imageData)

      const lines = text.split('\n').filter(line => line.trim())
      
      const pageText: string[] = []
      lines.forEach(line => {
        const trimmedLine = line.trim()
        if (trimmedLine) {
          pageText.push(trimmedLine)
        }
      })

      if (pageNum === 1 && pageText.length > 0) {
        const firstLine = pageText[0]
        const headerCols = splitLineIntoColumns(firstLine)
        if (headerCols.length > 1) {
          headers.push(...headerCols)
        }
      }

      pageText.forEach(line => {
        const columns = splitLineIntoColumns(line)
        if (columns.length > 0) {
          allText.push(columns)
        }
      })

      const pageProgress = 10 + ((pageNum / numPages) * 70)
      onProgress?.(pageProgress)
    }

    await worker.terminate()

    onProgress?.(85)

    // Criar estrutura de dados para Excel
    const worksheetData: any[][] = []

    if (headers.length > 0) {
      worksheetData.push(headers)
    }

    allText.forEach(row => {
      if (Array.isArray(row) && row.length > 0) {
        worksheetData.push(row)
      }
    })

    // Normalizar número de colunas
    if (worksheetData.length > 0) {
      const maxCols = Math.max(...worksheetData.map(row => row.length))
      worksheetData.forEach(row => {
        while (row.length < maxCols) {
          row.push('')
        }
      })
    }

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

    if (worksheetData.length > 0) {
      const maxCols = Math.max(...worksheetData.map(row => row.length))
      const colWidths = Array.from({ length: maxCols }, (_, colIndex) => {
        const maxLength = Math.max(
          ...worksheetData.map(row => {
            const cellValue = row[colIndex]?.toString() || ''
            return cellValue.length
          })
        )
        return { wch: Math.min(maxLength + 2, 50) }
      })
      worksheet['!cols'] = colWidths
    }

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados do PDF (OCR)')

    onProgress?.(95)

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const fileName = file.name.replace('.pdf', '_OCR.xlsx')
    saveAs(blob, fileName)

    onProgress?.(100)
  } catch (error) {
    console.error('Erro ao converter PDF com OCR:', error)
    throw new Error('Erro ao processar o PDF com OCR. Verifique se o arquivo está correto.')
  }
}

