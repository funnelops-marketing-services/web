'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  Bot,
  Funnel,
  Menu,
  Settings,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { usePermissions } from '@/hooks/use-permissions'
import { Logo } from './Logo'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  requiresConfig?: boolean
}

const navItems: readonly NavItem[] = [
  { label: 'Embudo de ventas', href: '/crm', icon: Funnel },
  { label: 'Contactos', href: '/crm/contacts', icon: Users },
  { label: 'Agentes', href: '/crm/agents', icon: Bot, requiresConfig: true },
  { label: 'Catálogo', href: '/crm/catalogo', icon: BookOpen, requiresConfig: true },
  { label: 'Usuarios', href: '/crm/users', icon: ShieldCheck, requiresConfig: true },
  // Ajustes = "Mi cuenta" (todos los usuarios logueados).
  { label: 'Ajustes', href: '/crm/settings', icon: Settings },
]

function isActive(pathname: string, href: string): boolean {
  // The board lives at the /crm root: mark active only on exact match, not on
  // every /crm/* path (otherwise it would stay highlighted everywhere).
  if (href === '/crm') return pathname === '/crm'
  return pathname === href || pathname.startsWith(`${href}/`)
}

interface NavListProps {
  pathname: string
  onSelect?: () => void
}

function NavList({ pathname, onSelect }: NavListProps) {
  const { canManageConfig } = usePermissions()
  const visibleItems = navItems.filter((item) => !item.requiresConfig || canManageConfig)

  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {visibleItems.map((item) => {
        const Icon = item.icon
        const active = isActive(pathname, item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onSelect}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-normal transition-all',
              active
                ? 'border-violet-500/30 bg-violet-500/15 text-white shadow-[0_0_25px_-12px_rgba(167,139,250,0.7)]'
                : 'border-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-white',
            )}
          >
            <Icon
              className={cn(
                'size-4 flex-shrink-0 transition-colors',
                active
                  ? 'text-violet-300'
                  : 'text-zinc-500 group-hover:text-zinc-300',
              )}
            />
            <span className="truncate">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Trigger mobile + drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Abrir navegación"
            className="fixed top-3 left-3 z-40 text-zinc-400 hover:bg-white/5 hover:text-white md:hidden"
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 border-r border-white/5 bg-zinc-950 p-0 text-white"
        >
          <SheetTitle className="sr-only">Navegación CRM</SheetTitle>
          <div className="flex h-16 items-center border-b border-white/5 px-5">
            <Logo />
          </div>
          <NavList pathname={pathname} onSelect={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Sidebar desktop */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-white/5 bg-black/40 backdrop-blur-xl md:flex">
        <div className="flex h-16 items-center border-b border-white/5 px-5">
          <Logo />
        </div>
        <NavList pathname={pathname} />
      </aside>
    </>
  )
}
