import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-white/[0.04] py-6 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-zinc-600 text-xs font-normal tracking-wide">&copy; 2026 Mirko Calzadilla</p>
        <div className="flex items-center gap-5">
          <Link
            href="/privacidad"
            className="text-zinc-600 hover:text-zinc-400 text-xs font-normal tracking-wide transition-colors"
          >
            Política de privacidad
          </Link>
          <p className="text-zinc-600 text-xs font-normal tracking-wide">Productor Audiovisual</p>
        </div>
      </div>
    </footer>
  )
}
