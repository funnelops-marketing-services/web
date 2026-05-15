'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronRight, LogOut, UserCog } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/use-auth'

const segmentLabels: Record<string, string> = {
  crm: 'CRM',
  inbox: 'Inbox',
  conversations: 'Conversaciones',
  contacts: 'Contactos',
  agents: 'Agentes',
  settings: 'Ajustes',
}

interface Crumb {
  label: string
  href: string
}

function buildBreadcrumb(pathname: string): readonly Crumb[] {
  const segments = pathname.split('/').filter(Boolean)
  return segments.map((segment, idx) => ({
    label: segmentLabels[segment] ?? segment,
    href: '/' + segments.slice(0, idx + 1).join('/'),
  }))
}

function initialsOf(name: string): string {
  const parts = name.split(' ').filter(Boolean).slice(0, 2)
  const result = parts.map((p) => p.charAt(0).toUpperCase()).join('')
  return result === '' ? '?' : result
}

export function Topbar() {
  const pathname = usePathname()
  const router = useRouter()
  const crumbs = useMemo(() => buildBreadcrumb(pathname), [pathname])
  const { session, signOut } = useAuth()

  const userName = session?.user.full_name?.trim() || session?.user.email || 'Usuario'
  const userEmail = session?.user.email ?? ''
  const tenantName = session?.tenant.name ?? '—'

  const handleSignOut = () => {
    signOut()
    router.replace('/login')
  }

  return (
    <header className="relative z-20 h-16 flex-shrink-0 border-b border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-4 pl-14 pr-4 md:px-6">
        <nav
          aria-label="Ruta de navegación"
          className="flex min-w-0 items-center gap-1.5"
        >
          {crumbs.length === 0 ? (
            <span className="text-sm text-zinc-500">/</span>
          ) : (
            crumbs.map((crumb, idx) => {
              const last = idx === crumbs.length - 1
              return (
                <div
                  key={crumb.href}
                  className="flex min-w-0 items-center gap-1.5"
                >
                  {idx > 0 && (
                    <ChevronRight className="size-3.5 flex-shrink-0 text-zinc-700" />
                  )}
                  {last ? (
                    <span className="truncate text-sm font-medium text-white">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="truncate text-sm font-normal text-zinc-500 transition-colors hover:text-zinc-300"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </div>
              )
            })
          )}
        </nav>

        <div className="flex flex-shrink-0 items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 sm:flex">
            <div className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-xs font-normal text-zinc-300">
              {tenantName}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                aria-label="Menú de usuario"
                className="h-9 gap-2 rounded-full px-2 text-zinc-300 hover:bg-white/5 hover:text-white"
              >
                <Avatar className="size-7">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white">
                    {initialsOf(userName)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-normal sm:inline">
                  {userName.split(' ')[0]}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 border-white/10 bg-zinc-950 text-zinc-200"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5">
                  <span className="truncate text-sm font-medium text-white">
                    {userName}
                  </span>
                  <span className="truncate text-xs text-zinc-500">
                    {userEmail}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem className="text-zinc-300 focus:bg-white/5 focus:text-white">
                <UserCog className="size-4" />
                Mi cuenta
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={handleSignOut}
                className="text-zinc-300 focus:bg-white/5 focus:text-white"
              >
                <LogOut className="size-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
