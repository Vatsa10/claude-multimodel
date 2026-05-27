export default function Footer() {
  return (
    <footer className="border-t border-zinc-100 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <span className="font-mono text-sm font-semibold text-zinc-950">claude-mm</span>
          <span className="text-xs text-zinc-400">v1.0.0</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-zinc-400">
          <a
            href="https://www.npmjs.com/package/claude-multimodel"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-700 transition-colors"
          >
            npm
          </a>
          <a
            href="https://github.com/Vatsa10/claude-multimodel"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-700 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://github.com/Vatsa10/claude-multimodel/blob/main/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-700 transition-colors"
          >
            Docs
          </a>
        </div>

        <p className="text-xs text-zinc-400">
          MIT License. Built by{' '}
          <a
            href="https://github.com/Vatsa10"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            Vatsa10
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
