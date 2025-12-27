'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ContatoPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [assunto, setAssunto] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Criar mailto link
    const mailtoLink = `mailto:contato@pdfutilities.com?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(
      `Nome: ${nome}\nEmail: ${email}\n\nMensagem:\n${mensagem}`
    )}`
    
    window.location.href = mailtoLink
    setEnviado(true)
    
    // Reset form após 3 segundos
    setTimeout(() => {
      setNome('')
      setEmail('')
      setAssunto('')
      setMensagem('')
      setEnviado(false)
    }, 3000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="mb-4 sm:mb-6 text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 text-sm sm:text-base inline-flex"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </Link>

          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
              Entre em Contato
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Fale Conosco
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Tem dúvidas, sugestões ou encontrou algum problema? Estamos aqui para ajudar! 
                  Envie sua mensagem e responderemos o mais breve possível.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-800">Email</h3>
                      <p className="text-gray-600 text-sm">contato@pdfutilities.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-800">Horário de Atendimento</h3>
                      <p className="text-gray-600 text-sm">Segunda a Sexta, 9h às 18h (Horário de Brasília)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-800">Suporte</h3>
                      <p className="text-gray-600 text-sm">Resposta em até 24-48 horas úteis</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Envie sua Mensagem
                </h2>
                
                {enviado && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800">✓ Seu cliente de email foi aberto! Complete o envio no seu programa de email.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="assunto" className="block text-sm font-medium text-gray-700 mb-1">
                      Assunto *
                    </label>
                    <select
                      id="assunto"
                      required
                      value={assunto}
                      onChange={(e) => setAssunto(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="Dúvida sobre ferramenta">Dúvida sobre ferramenta</option>
                      <option value="Problema técnico">Problema técnico</option>
                      <option value="Sugestão de melhoria">Sugestão de melhoria</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Parceria">Parceria</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem *
                    </label>
                    <textarea
                      id="mensagem"
                      required
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Descreva sua dúvida, problema ou sugestão..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Enviar Mensagem
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    Ao enviar, você concorda com nossa <Link href="/privacidade" className="text-primary-600 hover:underline">Política de Privacidade</Link>
                  </p>
                </form>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Perguntas Frequentes
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Como posso reportar um bug?</h3>
                  <p className="text-sm text-gray-600">
                    Selecione "Problema técnico" no formulário acima e descreva o problema em detalhes, 
                    incluindo qual ferramenta você estava usando e o que aconteceu.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Posso sugerir novas funcionalidades?</h3>
                  <p className="text-sm text-gray-600">
                    Sim! Adoramos ouvir sugestões dos nossos usuários. Use a opção "Sugestão de melhoria" 
                    e conte-nos sua ideia.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Vocês oferecem suporte técnico?</h3>
                  <p className="text-sm text-gray-600">
                    Sim, respondemos todas as mensagens de suporte. Normalmente respondemos em até 24-48 horas úteis.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Posso usar as ferramentas para fins comerciais?</h3>
                  <p className="text-sm text-gray-600">
                    Sim, nossas ferramentas são gratuitas para uso pessoal e comercial. 
                    Consulte nossos <Link href="/termos" className="text-primary-600 hover:underline">Termos de Uso</Link> para mais detalhes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

