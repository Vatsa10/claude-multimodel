'use client'

import { motion } from 'motion/react'
import { Warning } from '@phosphor-icons/react'

type Compat = 'native' | 'compatible' | 'litellm'

const providers: { name: string; label: string; flagship: string; fast: string; compat: Compat }[] = [
  { name: 'anthropic', label: 'Anthropic', flagship: 'claude-opus-4-7', fast: 'claude-haiku-4-5', compat: 'native' },
  { name: 'deepseek', label: 'DeepSeek', flagship: 'deepseek-v4-pro', fast: 'deepseek-v4-flash', compat: 'compatible' },
  { name: 'openai', label: 'OpenAI', flagship: 'gpt-5.5', fast: 'gpt-4o-mini', compat: 'compatible' },
  { name: 'gemini', label: 'Google Gemini', flagship: 'gemini-2.5-pro', fast: 'gemini-2.5-flash', compat: 'compatible' },
  { name: 'groq', label: 'Groq', flagship: 'llama-3.3-70b-versatile', fast: 'llama-3.1-8b-instant', compat: 'compatible' },
  { name: 'mistral', label: 'Mistral AI', flagship: 'mistral-large-latest', fast: 'mistral-small-latest', compat: 'compatible' },
  { name: 'together', label: 'Together AI', flagship: 'llama-3.3-70b-turbo', fast: 'llama-3.2-3b-turbo', compat: 'compatible' },
  { name: 'qwen', label: 'Qwen (Alibaba)', flagship: 'qwen-max', fast: 'qwen-turbo', compat: 'compatible' },
  { name: 'openrouter', label: 'OpenRouter', flagship: '100+ models', fast: 'any', compat: 'litellm' },
  { name: 'ollama', label: 'Ollama', flagship: 'llama3.3:70b', fast: 'llama3.2:3b', compat: 'compatible' },
  { name: 'kimi', label: 'Kimi (Moonshot)', flagship: 'moonshot-v1-128k', fast: 'moonshot-v1-8k', compat: 'litellm' },
  { name: 'glm', label: 'GLM (Zhipu AI)', flagship: 'glm-4-plus', fast: 'glm-4-flash', compat: 'litellm' },
]

const badges: Record<Compat, { label: string; className: string }> = {
  native: {
    label: 'Native',
    className: 'bg-blue-light text-blue-accent border border-blue-border',
  },
  compatible: {
    label: 'Compatible',
    className: 'bg-zinc-50 text-zinc-600 border border-zinc-200',
  },
  litellm: {
    label: 'LiteLLM',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
}

export default function Providers() {
  return (
    <section id="providers" className="py-28 bg-zinc-50 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-950 mb-4">
            Every major provider, built in
          </h2>
          <p className="text-zinc-500 text-lg max-w-[48ch]">
            Anthropic-compatible providers work directly. OpenAI-only providers bridge via LiteLLM.
          </p>
        </motion.div>

        {/* legend */}
        <div className="flex flex-wrap gap-3 mb-8">
          {(Object.entries(badges) as [Compat, { label: string; className: string }][]).map(([key, b]) => (
            <span key={key} className={`text-xs font-mono px-2.5 py-1 rounded-full ${b.className}`}>
              {key === 'litellm' && <Warning size={11} className="inline mr-1" />}
              {b.label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {providers.map((p, i) => {
            const badge = badges[p.compat]
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -2 }}
                className="bg-white border border-zinc-200 rounded-xl p-5 flex flex-col gap-3 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-semibold text-zinc-950">{p.name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full whitespace-nowrap ${badge.className}`}>
                    {p.compat === 'litellm' && <Warning size={9} className="inline mr-0.5" />}
                    {badge.label}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">{p.label}</p>
                <div className="mt-auto space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-zinc-400 font-mono w-12 flex-shrink-0">main</span>
                    <span className="text-[10px] font-mono text-zinc-600 truncate">{p.flagship}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-zinc-400 font-mono w-12 flex-shrink-0">fast</span>
                    <span className="text-[10px] font-mono text-zinc-600 truncate">{p.fast}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-xs text-zinc-400 font-mono"
        >
          LiteLLM providers require a local proxy running on port 4000.
          Run: <span className="text-zinc-600">litellm --model openrouter/... --port 4000</span>
        </motion.p>
      </div>
    </section>
  )
}
