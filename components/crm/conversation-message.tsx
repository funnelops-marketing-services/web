'use client'

import { Bot, UserRound } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { ThreadMessage } from '@/lib/api/crm'

function formatTime(at: string): string {
  const date = new Date(at)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
}

const senderLabel: Record<ThreadMessage['sender'], string> = {
  lead: 'Lead',
  agent: 'Agente IA',
  human: 'Gestión Humana',
}

/** Burbuja del hilo espejo de WhatsApp, según el emisor. */
export function ConversationMessage({ message }: { message: ThreadMessage }) {
  const isLead = message.sender === 'lead'
  const isAgent = message.sender === 'agent'
  const time = formatTime(message.at)

  return (
    <div className={cn('flex', isLead ? 'justify-start' : 'justify-end')}>
      <div className="max-w-[85%]">
        {!isLead && (
          <div className="mb-1 flex items-center justify-end gap-1">
            {isAgent ? (
              <Bot className="size-3 text-violet-400" />
            ) : (
              <UserRound className="size-3 text-fuchsia-400" />
            )}
            <span
              className={cn(
                'text-[10px] font-normal',
                isAgent ? 'text-violet-400' : 'text-fuchsia-400',
              )}
            >
              {senderLabel[message.sender]}
            </span>
          </div>
        )}
        <div
          className={cn(
            'rounded-2xl px-3.5 py-2.5',
            isLead &&
              'rounded-bl-md border border-white/5 bg-white/5 text-white',
            isAgent &&
              'rounded-br-md bg-gradient-to-br from-violet-600 to-violet-700 text-white shadow-[0_0_20px_-10px_rgba(139,92,246,0.6)]',
            !isLead && !isAgent && 'rounded-br-md bg-fuchsia-600 text-white',
          )}
        >
          <p className="text-sm font-normal leading-relaxed">{message.text}</p>
        </div>
        {time && (
          <p
            className={cn(
              'mt-1 text-[10px] font-normal text-zinc-600',
              isLead ? 'text-left' : 'text-right',
            )}
          >
            {time}
          </p>
        )}
      </div>
    </div>
  )
}
