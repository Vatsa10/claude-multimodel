'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Copy, Check, ArrowRight } from '@phosphor-icons/react'

const providers = [
  { name: 'deepseek', model: 'deepseek-v4-pro', label: 'DeepSeek', color: '#2563eb' },
  { name: 'gemini', model: 'gemini-2.5-pro', label: 'Google Gemini', color: '#2563eb' },
  { name: 'openai', model: 'gpt-5.5', label: 'OpenAI', color: '#2563eb' },
  { name: 'claude', model: 'claude-sonnet (default)', label: 'Anthropic', color: '#2563eb' },
  { name: 'groq', model: 'llama-3.3-70b-versatile', label: 'Groq', color: '#2563eb' },
]

const INSTALL_CMD = 'npm install -g claude-multimodel'

export default function Hero() {
  const [copied, setCopied] = useState(false)
  const [providerIdx, setProviderIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setProviderIdx(i => (i + 1) % providers.length)
    }, 2200)
    return () => clearInterval(t)
  }, [])

  const copy = async () => {
    await navigator.clipboard.writeText(INSTALL_CMD)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const current = providers[providerIdx]

  return (
    <section className="min-h-[100dvh] flex items-center pt-16">
      <div className="max-w-7xl mx-auto px-6 w-full py-20 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-center">

        {/* Left */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 bg-blue-light border border-blue-border text-blue-accent text-xs font-mono px-3 py-1.5 rounded-full mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-accent inline-block" />
            CLI plugin for Claude Code
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-zinc-950 mb-6"
          >
            One CLI.<br />Every AI.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-zinc-500 leading-relaxed max-w-[52ch] mb-10"
          >
            Switch between DeepSeek, Gemini, OpenAI, Groq, and more in Claude Code.
            Install once, works globally in every project.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-3 mb-10"
          >
            <div className="flex items-center gap-3 bg-zinc-950 text-zinc-100 font-mono text-sm px-5 py-3.5 rounded-xl flex-1 max-w-sm">
              <span className="text-zinc-500 select-none">$</span>
              <span className="flex-1">{INSTALL_CMD.replace('$ ', '')}</span>
              <button
                onClick={copy}
                className="text-zinc-500 hover:text-zinc-200 transition-colors ml-2 cursor-pointer"
                aria-label="Copy install command"
              >
                {copied
                  ? <Check size={15} weight="bold" className="text-blue-accent" />
                  : <Copy size={15} />
                }
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <a
              href="https://www.npmjs.com/package/claude-multimodel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-accent text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors"
            >
              View on npm <ArrowRight size={14} weight="bold" />
            </a>
            <a
              href="#providers"
              className="text-sm text-zinc-500 hover:text-zinc-950 transition-colors"
            >
              Browse providers
            </a>
          </motion.div>
        </div>

        {/* Right - provider switcher */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-sm bg-white">
            {/* card header */}
            <div className="border-b border-zinc-100 px-5 py-4 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
              <span className="ml-2 font-mono text-xs text-zinc-400">claude-mm active profile</span>
            </div>

            {/* animated provider */}
            <div className="px-5 py-6 min-h-[220px] relative">
              <p className="text-xs text-zinc-400 font-mono mb-4">Active profile</p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-blue-accent flex-shrink-0" />
                    <span className="font-mono font-semibold text-zinc-950 text-lg">{current.name}</span>
                  </div>
                  <p className="text-sm text-zinc-500 font-mono ml-4.5 mb-1">{current.model}</p>
                  <p className="text-xs text-zinc-400 font-mono ml-4.5 mb-6">{current.label}</p>

                  <div className="bg-zinc-50 border border-zinc-100 rounded-lg px-4 py-3 font-mono text-xs text-zinc-500">
                    <span className="text-blue-accent">$</span>{' '}
                    claude-mm launch{' '}
                    <span className="text-zinc-950">{current.name}</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* dots */}
              <div className="flex gap-1.5 mt-6">
                {providers.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setProviderIdx(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                      i === providerIdx ? 'bg-blue-accent w-4' : 'bg-zinc-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* bottom row */}
            <div className="border-t border-zinc-100 px-5 py-3 bg-zinc-50 flex items-center justify-between">
              <span className="font-mono text-xs text-zinc-400">10+ providers available</span>
              <span className="inline-flex items-center gap-1 text-xs text-blue-accent font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-accent animate-pulse" />
                active
              </span>
            </div>
          </div>

          {/* stat pills */}
          <div className="flex gap-3 mt-4">
            <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-center">
              <p className="font-mono text-xl font-bold text-zinc-950">10+</p>
              <p className="text-xs text-zinc-500 mt-0.5">providers</p>
            </div>
            <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-center">
              <p className="font-mono text-xl font-bold text-zinc-950">0</p>
              <p className="text-xs text-zinc-500 mt-0.5">config files</p>
            </div>
            <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-center">
              <p className="font-mono text-xl font-bold text-zinc-950">1</p>
              <p className="text-xs text-zinc-500 mt-0.5">command</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
