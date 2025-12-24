'use client'

export default function Navbar() {
  const tools = [
    { id: 'text', name: 'PDF para Excel' },
    { id: 'ocr', name: 'PDF Escaneado' },
    { id: 'merge', name: 'Juntar PDFs' },
    { id: 'split', name: 'Dividir PDF' },
  ]

  const handleToolClick = (toolId: string) => {
    // Scroll para o topo e atualiza a URL com o modo selecionado
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // Dispara evento customizado para mudar o modo na página principal
    window.dispatchEvent(new CustomEvent('changeTool', { detail: toolId }))
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          {/* Logo e Nome */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
              window.dispatchEvent(new CustomEvent('changeTool', { detail: null }))
            }}
          >
            <img
              src="/logo.png"
              alt="PDFUtilities Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-2xl font-bold text-primary-600">PDFUtilities</span>
          </div>

          {/* Ferramentas - Próximas do lado esquerdo */}
          <div className="flex items-center gap-1 md:gap-3 ml-6">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool.id)}
                className="px-3 md:px-4 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium text-sm md:text-base"
              >
                {tool.name}
              </button>
            ))}
          </div>

          {/* Espaço reservado para login/cadastro no futuro */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Futuro: botões de login e cadastro aqui */}
          </div>
        </div>
      </div>
    </nav>
  )
}

