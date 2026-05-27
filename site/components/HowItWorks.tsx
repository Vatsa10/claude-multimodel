'use client'

import { motion } from 'motion/react'
import { DownloadSimple, Key, RocketLaunch } from '@phosphor-icons/react'

const steps = [
  {
    icon: DownloadSimple,
    title: 'Install globally',
    description: 'One install. Slash commands register automatically in Claude Code.',
    cmd: 'npm install -g claude-multimodel',
  },
  {
    icon: Key,
    title: 'Set your API key',
    description: 'Hidden input keeps keys out of shell history and chat.',
    cmd: 'claude-mm set-key deepseek',
  },
  {
    icon: RocketLaunch,
    title: 'Launch with any model',
    description: 'Switch providers in seconds. Relaunch to apply the new profile.',
    cmd: 'claude-mm launch deepseek',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-28 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-950 mb-4">
            Up in three commands
          </h2>
          <p className="text-zinc-500 text-lg max-w-[46ch]">
            No config files. No environment juggling. Works in every project immediately.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-200 rounded-2xl overflow-hidden">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white p-8 flex flex-col gap-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-blue-light border border-blue-border flex items-center justify-center flex-shrink-0">
                    <Icon size={18} weight="bold" className="text-blue-accent" />
                  </div>
                  <span className="font-mono text-xs text-zinc-400 pt-2.5">{String(i + 1).padStart(2, '0')}</span>
                </div>

                <div>
                  <h3 className="font-semibold text-zinc-950 text-lg mb-2">{step.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{step.description}</p>
                </div>

                <div className="mt-auto bg-zinc-950 rounded-lg px-4 py-3 font-mono text-xs text-zinc-300">
                  <span className="text-blue-accent">$</span>{' '}
                  {step.cmd}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
