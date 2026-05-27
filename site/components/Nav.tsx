'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { GithubLogo } from '@phosphor-icons/react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const copy = async () => {
    await navigator.clipboard.writeText('npm install -g claude-multimodel')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm border-b border-zinc-200' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-mono text-sm font-semibold text-zinc-950 tracking-tight">
          claude-mm
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#providers" className="text-sm text-zinc-500 hover:text-zinc-950 transition-colors">
            Providers
          </a>
          <a href="#features" className="text-sm text-zinc-500 hover:text-zinc-950 transition-colors">
            Features
          </a>
          <a
            href="https://www.npmjs.com/package/claude-multimodel"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 hover:text-zinc-950 transition-colors"
          >
            npm
          </a>
          <a
            href="https://github.com/Vatsa10/claude-multimodel"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-950 transition-colors"
          >
            <GithubLogo size={18} weight="fill" />
          </a>
        </div>

        <motion.button
          onClick={copy}
          whileTap={{ scale: 0.97 }}
          className="hidden md:flex items-center gap-2 bg-blue-accent text-white text-xs font-mono px-4 py-2 rounded-full hover:bg-blue-700 transition-colors cursor-pointer"
        >
          {copied ? 'Copied!' : 'npm install -g claude-multimodel'}
        </motion.button>
      </nav>
    </header>
  )
}
