'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface TranslationStatus {
  stage: 'idle' | 'uploading' | 'extracting' | 'translating' | 'rebuilding' | 'complete' | 'error';
  message: string;
  progress: number;
}

export default function TranslatorPDFUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [startPage, setStartPage] = useState<number>(1);
  const [endPage, setEndPage] = useState<number | ''>('');
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<TranslationStatus>({
    stage: 'idle',
    message: '',
    progress: 0
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_TRANSLATOR_API_URL || 'https://api.pdf-utilities.com.br/translator-api';

  // Handlers de Drag & Drop
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setStatus({ stage: 'idle', message: '', progress: 0 });
    } else {
      setStatus({
        stage: 'error',
        message: 'Apenas arquivos PDF são permitidos',
        progress: 0
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus({ stage: 'idle', message: '', progress: 0 });
    }
  };

  const handleTranslate = async () => {
    if (!file) {
      setStatus({
        stage: 'error',
        message: 'Por favor, selecione um arquivo PDF',
        progress: 0
      });
      return;
    }

    if (startPage < 1) {
      setStatus({
        stage: 'error',
        message: 'Página inicial deve ser maior que 0',
        progress: 0
      });
      return;
    }

    if (endPage !== '' && endPage < startPage) {
      setStatus({
        stage: 'error',
        message: 'Página final deve ser maior ou igual à página inicial',
        progress: 0
      });
      return;
    }

    try {
      // Preparar FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('start_page', startPage.toString());
      if (endPage !== '') {
        formData.append('end_page', endPage.toString());
      }

      // Simular progresso (API não retorna progresso em tempo real)
      setStatus({
        stage: 'uploading',
        message: 'Enviando PDF...',
        progress: 10
      });

      setTimeout(() => {
        setStatus({
          stage: 'extracting',
          message: 'Extraindo texto com Google Vision API...',
          progress: 30
        });
      }, 1000);

      setTimeout(() => {
        setStatus({
          stage: 'translating',
          message: 'Traduzindo com modelo Gemma 2 2B...',
          progress: 60
        });
      }, 3000);

      setTimeout(() => {
        setStatus({
          stage: 'rebuilding',
          message: 'Reconstruindo PDF traduzido...',
          progress: 85
        });
      }, 5000);

      // Fazer request
      const response = await fetch(`${apiUrl}/translate`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao traduzir PDF');
      }

      // Baixar PDF traduzido
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `traduzido_${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setStatus({
        stage: 'complete',
        message: 'PDF traduzido com sucesso! Download iniciado.',
        progress: 100
      });

      // Reset após 5 segundos
      setTimeout(() => {
        setFile(null);
        setStatus({ stage: 'idle', message: '', progress: 0 });
      }, 5000);

    } catch (error) {
      console.error('Erro na tradução:', error);
      setStatus({
        stage: 'error',
        message: error instanceof Error ? error.message : 'Erro desconhecido ao traduzir PDF',
        progress: 0
      });
    }
  };

  const getStageText = () => {
    switch (status.stage) {
      case 'uploading': return 'Enviando...';
      case 'extracting': return 'Extraindo texto...';
      case 'translating': return 'Traduzindo...';
      case 'rebuilding': return 'Reconstruindo PDF...';
      case 'complete': return 'Concluído!';
      case 'error': return 'Erro';
      default: return '';
    }
  };

  const isProcessing = ['uploading', 'extracting', 'translating', 'rebuilding'].includes(status.stage);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Área de Upload */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : file
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={isProcessing}
        />

        {file ? (
          <div className="space-y-4">
            <div className="text-6xl">📄</div>
            <div>
              <p className="text-lg font-semibold text-green-700">{file.name}</p>
              <p className="text-sm text-gray-600">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700 underline"
              disabled={isProcessing}
            >
              Escolher outro arquivo
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl">📤</div>
            <div>
              <p className="text-lg font-semibold text-gray-700">
                Arraste um PDF aqui
              </p>
              <p className="text-sm text-gray-500">ou</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Selecionar Arquivo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Configurações de Páginas */}
      {file && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Configurações de Tradução
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Página Inicial
              </label>
              <input
                type="number"
                min="1"
                value={startPage}
                onChange={(e) => setStartPage(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isProcessing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Página Final (opcional)
              </label>
              <input
                type="number"
                min={startPage}
                value={endPage}
                onChange={(e) => setEndPage(e.target.value === '' ? '' : parseInt(e.target.value))}
                placeholder="Deixe vazio para todas"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isProcessing}
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>📌 Dica:</strong> Processar muitas páginas pode demorar. 
              Recomendamos começar com até 10 páginas por vez.
            </p>
          </div>
        </div>
      )}

      {/* Barra de Progresso */}
      {isProcessing && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-800">
              {getStageText()}
            </span>
            <span className="text-sm text-gray-600">{status.progress}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${status.progress}%` }}
            ></div>
          </div>

          <p className="text-sm text-gray-600 text-center">
            {status.message}
          </p>
        </div>
      )}

      {/* Mensagens de Status */}
      {status.stage === 'complete' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">✅</span>
            <div>
              <p className="text-lg font-semibold text-green-800">
                {status.message}
              </p>
              <p className="text-sm text-green-700">
                O arquivo foi salvo automaticamente no seu computador.
              </p>
            </div>
          </div>
        </div>
      )}

      {status.stage === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">❌</span>
            <div>
              <p className="text-lg font-semibold text-red-800">Erro</p>
              <p className="text-sm text-red-700">{status.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Botão de Traduzir */}
      {file && !isProcessing && status.stage !== 'complete' && (
        <button
          onClick={handleTranslate}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          🚀 Traduzir PDF
        </button>
      )}

      {/* Informações Adicionais */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-3 text-sm text-gray-700">
        <h4 className="font-semibold text-gray-900">ℹ️ Informações Importantes:</h4>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Tempo estimado:</strong> ~5-10 segundos por página</li>
          <li><strong>Formatos aceitos:</strong> Apenas PDF</li>
          <li><strong>Tamanho máximo:</strong> 50 MB por arquivo</li>
          <li><strong>Idiomas:</strong> Inglês → Português (especializado em termos técnicos)</li>
          <li><strong>Modelo usado:</strong> Gemma 2 2B fine-tuned + Google Vision API</li>
        </ul>
      </div>
    </div>
  );
}

