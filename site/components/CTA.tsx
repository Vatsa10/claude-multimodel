'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Copy, Check, GithubLogo, Package } from '@phosphor-icons/react'

const INSTALL_CMD = 'npm install -g claude-multimodel'

export default function CTA() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(INSTALL_CMD)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-28 border-t border-zinc-100">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 mb-6">
            Start with one command
          </h2>
          <p className="text-zinc-500 text-lg mb-12 max-w-[44ch] mx-auto">
            Free. Open source. Works with Claude Code on Windows, Mac, and Linux.
          </p>

          {/* install command */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="flex items-center gap-3 bg-zinc-950 text-zinc-100 font-mono text-sm px-6 py-4 rounded-xl">
              <span className="text-zinc-500 select-none">$</span>
              <span>{INSTALL_CMD.replace('$ ', '')}</span>
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
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="https://www.npmjs.com/package/claude-multimodel"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2.5 bg-blue-accent text-white font-medium px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
            >
              <Package size={17} weight="fill" />
              View on npm
            </motion.a>
            <motion.a
              href="https://github.com/Vatsa10/claude-multimodel"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2.5 bg-white text-zinc-700 font-medium px-6 py-3 rounded-full border border-zinc-200 hover:border-zinc-400 hover:text-zinc-950 transition-colors"
            >
              <GithubLogo size={17} weight="fill" />
              View on GitHub
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
