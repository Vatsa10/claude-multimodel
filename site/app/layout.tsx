import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'claude-multimodel - One CLI. Every AI.',
  description:
    'Switch between DeepSeek, Gemini, OpenAI, Groq, and more in Claude Code. Install once, works globally in every project.',
  keywords: ['claude', 'claude code', 'deepseek', 'gemini', 'openai', 'multi-model', 'cli', 'anthropic'],
  openGraph: {
    title: 'claude-multimodel',
    description: 'One CLI. Every AI.',
    url: 'https://claude-multimodel.vatsa.online',
    siteName: 'claude-multimodel',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'claude-multimodel - One CLI. Every AI.',
    description: 'Switch between AI providers in Claude Code with a single command.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-white text-zinc-950 antialiased">
        {children}
      </body>
    </html>
  )
}
