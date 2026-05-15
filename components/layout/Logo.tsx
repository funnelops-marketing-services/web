import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="size-2 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 shadow-[0_0_12px_-2px_rgba(167,139,250,0.7)]" />
      <span className="text-white font-bold text-xs tracking-[0.2em]">
        MIRKO · CRM
      </span>
    </div>
  )
}
