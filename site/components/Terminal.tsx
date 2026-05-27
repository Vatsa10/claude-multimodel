'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const tabs = [
  {
    label: 'launch',
    lines: [
      { prefix: '$', text: 'claude-mm', args: ' launch deepseek', delay: 0 },
      { prefix: '', text: '', args: '', delay: 0.4, output: true, content: 'Profile: deepseek — DeepSeek v4 Pro' },
      { prefix: '', text: '', args: '', delay: 0.5, output: true, content: 'Model: deepseek-v4-pro  Effort: max' },
      { prefix: '', text: '', args: '', delay: 0.7, output: true, content: '' },
      { prefix: '', text: '', args: '', delay: 0.8, output: true, content: 'Starting claude...' },
    ],
  },
  {
    label: 'set-default',
    lines: [
      { prefix: '$', text: 'claude-mm', args: ' set-default deepseek', delay: 0 },
      { prefix: '', text: '', args: '', delay: 0.4, output: true, content: '✓ Written to ~/Documents/PowerShell/profile.ps1' },
      { prefix: '', text: '', args: '', delay: 0.6, output: true, content: '✓ Default profile set to \'deepseek\'' },
      { prefix: '', text: '', args: '', delay: 0.8, output: true, content: 'Restart terminal. Then plain claude uses DeepSeek.' },
    ],
  },
  {
    label: 'set-model',
    lines: [
      { prefix: '$', text: 'claude-mm', args: ' set-model deepseek deepseek-r1 deepseek-v4-flash', delay: 0 },
      { prefix: '', text: '', args: '', delay: 0.5, output: true, content: '✓ Models updated for \'deepseek\'' },
      { prefix: '', text: '', args: '', delay: 0.6, output: true, content: '  Main:     deepseek-r1' },
      { prefix: '', text: '', args: '', delay: 0.7, output: true, content: '  Subagent: deepseek-v4-flash' },
    ],
  },
  {
    label: 'providers',
    lines: [
      { prefix: '$', text: 'claude-mm', args: ' providers', delay: 0 },
      { prefix: '', text: '', args: '', delay: 0.3, output: true, content: 'anthropic  — Anthropic         (native Anthropic)' },
      { prefix: '', text: '', args: '', delay: 0.4, output: true, content: 'deepseek   — DeepSeek          (Anthropic-compatible)' },
      { prefix: '', text: '', args: '', delay: 0.5, output: true, content: 'openai     — OpenAI            (Anthropic-compatible)' },
      { prefix: '', text: '', args: '', delay: 0.6, output: true, content: 'gemini     — Google Gemini     (Anthropic-compatible)' },
      { prefix: '', text: '', args: '', delay: 0.7, output: true, content: 'openrouter — OpenRouter        (needs LiteLLM proxy)' },
    ],
  },
]

export default function Terminal() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section className="py-28 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* left copy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-950 mb-6">
              Every workflow, one command away
            </h2>
            <p className="text-zinc-500 text-lg leading-relaxed mb-8 max-w-[42ch]">
              Launch Claude with any provider, make it permanent, update model IDs, or browse the full provider registry.
            </p>

            <div className="space-y-3">
              {[
                'claude-mm launch [profile]',
                'claude-mm set-default [profile]',
                'claude-mm set-model [profile] [model]',
                'claude-mm set-key [profile]',
                'claude-mm add',
              ].map((cmd, i) => (
                <motion.div
                  key={cmd}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-1 h-1 rounded-full bg-blue-accent flex-shrink-0" />
                  <code className="font-mono text-sm text-zinc-700">{cmd}</code>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* right terminal */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="bg-terminal rounded-2xl overflow-hidden border border-zinc-800"
          >
            {/* toolbar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="ml-3 flex gap-1">
                {tabs.map((t, i) => (
                  <button
                    key={t.label}
                    onClick={() => setActiveTab(i)}
                    className={`font-mono text-xs px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                      i === activeTab
                        ? 'bg-zinc-800 text-zinc-200'
                        : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* content */}
            <div className="px-5 py-5 min-h-[200px] font-mono text-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {tabs[activeTab].lines.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: line.delay, duration: 0.3 }}
                      className="flex gap-2 mb-1.5 leading-relaxed"
                    >
                      {line.prefix && (
                        <span className="text-blue-accent select-none">{line.prefix}</span>
                      )}
                      {line.text && (
                        <span className="text-zinc-200">{line.text}</span>
                      )}
                      {line.args && (
                        <span className="text-zinc-400">{line.args}</span>
                      )}
                      {line.output && line.content && (
                        <span className={`${line.content.startsWith('✓') ? 'text-blue-accent' : 'text-zinc-500'}`}>
                          {line.content}
                        </span>
                      )}
                    </motion.div>
                  ))}
                  <motion.div
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 1.1 }}
                    className="inline-block w-2 h-4 bg-zinc-500 mt-1"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
