'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import TranslatorPDFUploader from '@/components/TranslatorPDFUploader';

export default function TradutorTecnicoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirecionar se não autenticado ou não for admin
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'admin') {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  // Mostrar loading enquanto verifica autenticação
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não for admin, não renderizar nada (redirecionamento já aconteceu)
  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold">
              🔧 Tradutor Técnico
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Tradução especializada de PDFs técnicos usando <strong>IA Gemma 2 2B</strong>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Ferramenta exclusiva para administradores • Logado como: <strong>{session.user.email}</strong>
          </p>
        </div>

        {/* Badge Admin */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 border border-purple-300 rounded-full">
            <span className="text-purple-700 font-semibold text-sm">
              🔐 Acesso Administrativo
            </span>
          </div>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Descrição da Ferramenta */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ⚡ Como Funciona
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Extração</h3>
                  <p className="text-sm text-gray-600">
                    Google Vision API extrai texto com precisão mantendo posições
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Tradução</h3>
                  <p className="text-sm text-gray-600">
                    Modelo Gemma 2 2B traduz termos técnicos com alta precisão
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Reconstrução</h3>
                  <p className="text-sm text-gray-600">
                    PDF é reconstruído mantendo layout e formatação originais
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Componente de Upload */}
          <TranslatorPDFUploader />

          {/* Estatísticas/Features */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                <span className="text-2xl mr-2">🎯</span>
                Precisão Especializada
              </h3>
              <p className="text-sm text-green-800">
                Modelo treinado especificamente para terminologia técnica de 
                peças de motocicleta, garantindo traduções precisas e contextualizadas.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
                <span className="text-2xl mr-2">🔒</span>
                100% Privado
              </h3>
              <p className="text-sm text-purple-800">
                O modelo roda localmente no servidor. Seus documentos não são 
                enviados para serviços externos (exceto Google Vision para OCR).
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Dúvidas ou problemas? Entre em contato com o administrador do sistema.
          </p>
        </div>
      </div>
    </div>
  );
}
