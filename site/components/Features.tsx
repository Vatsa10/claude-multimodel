'use client'

import { motion } from 'motion/react'
import { Lock, Command, Swap, Globe, Cpu } from '@phosphor-icons/react'

export default function Features() {
  return (
    <section id="features" className="py-28 bg-zinc-50 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-950 mb-4">
            Built for how developers actually work
          </h2>
          <p className="text-zinc-500 text-lg max-w-[44ch]">
            From quick session switches to permanent global defaults. Every workflow covered.
          </p>
        </motion.div>

        {/* bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* large card - permanent defaults */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-8 flex flex-col gap-6"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-light border border-blue-border flex items-center justify-center">
              <Swap size={20} weight="bold" className="text-blue-accent" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-zinc-950 mb-2">Make any provider permanent</h3>
              <p className="text-zinc-500 leading-relaxed max-w-[48ch]">
                Write env vars directly to your shell profile. Even plain <code className="font-mono text-zinc-700 text-sm bg-zinc-100 px-1.5 py-0.5 rounded">claude</code> uses your chosen provider without touching claude-mm.
              </p>
            </div>
            <div className="bg-zinc-950 rounded-xl px-5 py-4 font-mono text-sm space-y-2">
              <div>
                <span className="text-blue-accent">$</span>{' '}
                <span className="text-zinc-200">claude-mm set-default deepseek</span>
              </div>
              <div className="text-blue-accent text-xs">
                {'>'} Written to $PROFILE
              </div>
              <div className="text-blue-accent text-xs">
                {'>'} Restart terminal. DeepSeek is now your default.
              </div>
            </div>
          </motion.div>

          {/* tall card - key safety */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="bg-blue-accent rounded-2xl p-8 flex flex-col gap-6 text-white"
          >
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
              <Lock size={20} weight="bold" className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Keys stored safely</h3>
              <p className="text-white/70 leading-relaxed">
                Hidden terminal input. Never pasted in chat, never in shell history. Stored locally in{' '}
                <code className="font-mono text-xs bg-white/15 px-1.5 py-0.5 rounded">~/.claude/multimodel/</code>.
              </p>
            </div>
            <div className="mt-auto bg-white/10 border border-white/20 rounded-xl px-4 py-3 font-mono text-sm text-white/80">
              <span className="text-white/40">$</span>{' '}claude-mm set-key deepseek
            </div>
          </motion.div>

          {/* slash commands */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white border border-zinc-200 rounded-2xl p-8 flex flex-col gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-light border border-blue-border flex items-center justify-center">
              <Command size={20} weight="bold" className="text-blue-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-950 mb-2">Slash commands inside Claude</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Use <code className="font-mono bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded text-xs">/multimodel/switch-profile</code> from within any Claude Code session.
              </p>
            </div>
            <div className="mt-auto space-y-1.5">
              {['/multimodel/switch-profile', '/multimodel/set-api-key', '/multimodel/add-profile'].map(cmd => (
                <div key={cmd} className="font-mono text-xs text-zinc-500 bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2">
                  {cmd}
                </div>
              ))}
            </div>
          </motion.div>

          {/* global install */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white border border-zinc-200 rounded-2xl p-8 flex flex-col gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-light border border-blue-border flex items-center justify-center">
              <Globe size={20} weight="bold" className="text-blue-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-950 mb-2">Works in every project</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Install once globally. Profiles and slash commands available in all Claude Code sessions across every directory.
              </p>
            </div>
          </motion.div>

          {/* custom models */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-zinc-950 rounded-2xl p-8 flex flex-col gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <Cpu size={20} weight="bold" className="text-zinc-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">Add any model or endpoint</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Custom base URLs, local Ollama instances, or any Anthropic-compatible endpoint.
              </p>
            </div>
            <div className="mt-auto font-mono text-xs text-zinc-400 bg-zinc-900 rounded-lg px-3 py-2">
              <span className="text-blue-accent">$</span>{' '}claude-mm add
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
