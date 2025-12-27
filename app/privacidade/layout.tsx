import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade - PDFUtilities',
  description: 'Leia nossa Política de Privacidade e saiba como protegemos seus dados e arquivos ao usar nossas ferramentas online gratuitas para PDF.',
  keywords: 'política de privacidade, privacidade pdf, proteção de dados',
}

export default function PrivacidadeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

