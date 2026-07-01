'use client'

import { Bot, Download, FileText, UserRound } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { ThreadMessage } from '@/lib/api/crm'

function formatTime(at: string): string {
  const date = new Date(at)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
}

/** Nombre de archivo legible a partir de la URL del adjunto (fallback: "documento"). */
function fileNameFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname
    return decodeURIComponent(path.slice(path.lastIndexOf('/') + 1)) || 'documento'
  } catch {
    return 'documento'
  }
}

const senderLabel: Record<ThreadMessage['sender'], string> = {
  lead: 'Lead',
  agent: 'Agente IA',
  human: 'Gestión Humana',
}

/** Contenido de la burbuja según el tipo de mensaje (texto, imagen, documento). */
function MessageContent({ message }: { message: ThreadMessage }) {
  // Imagen: miniatura clickeable que abre el original a tamaño completo.
  if (message.type === 'image' && message.media_url) {
    return (
      <a href={message.media_url} target="_blank" rel="noreferrer" className="block">
        <img
          src={message.media_url}
          alt={message.text || 'Imagen adjunta'}
          className="max-w-xs rounded-lg transition-opacity hover:opacity-90"
        />
      </a>
    )
  }
  // Documento: chip con ícono, nombre y acción de abrir/descargar.
  if (message.type === 'document' && message.media_url) {
    return (
      <a
        href={message.media_url}
        target="_blank"
        rel="noreferrer"
        download
        className="flex items-center gap-2.5 rounded-lg bg-black/20 px-3 py-2 transition-colors hover:bg-black/30"
      >
        <FileText className="size-5 shrink-0" />
        <span className="min-w-0 flex-1 truncate text-sm font-normal">
          {fileNameFromUrl(message.media_url)}
        </span>
        <Download className="size-4 shrink-0 opacity-70" />
      </a>
    )
  }
  return <p className="text-sm font-normal leading-relaxed">{message.text}</p>
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
          <MessageContent message={message} />
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
