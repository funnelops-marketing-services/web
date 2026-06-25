'use client'

import { useState } from 'react'
import { Bot, MessageSquare, QrCode, Send, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useCard } from '@/hooks/use-card'
import { useBoard } from '@/hooks/use-board'
import {
  useGenerateEntry,
  useSendHumanReply,
  useSetAiActive,
} from '@/hooks/use-card-mutations'
import { usePermissions } from '@/hooks/use-permissions'
import { ConversationMessage } from '@/components/crm/conversation-message'

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="px-6 text-center">
        <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03]">
          <MessageSquare className="size-6 text-zinc-700" />
        </div>
        <p className="text-sm font-normal text-zinc-500">{text}</p>
      </div>
    </div>
  )
}

/** Panel derecho: hilo espejo + toggle IA + input humano (takeover). */
export function ConversationPanel({
  cardId,
  onClose,
}: {
  cardId: string | null
  onClose?: () => void
}) {
  const { data: card, isLoading, isError } = useCard(cardId)
  const { data: boards } = useBoard()
  const { canOperateCrm } = usePermissions()
  const setAiActive = useSetAiActive(cardId ?? '')
  const generateEntryMutation = useGenerateEntry(cardId ?? '')
  const sendReply = useSendHumanReply(cardId ?? '')
  const [reply, setReply] = useState('')

  if (!cardId) return <EmptyState text="Seleccioná un lead para ver la conversación" />
  if (isLoading) return <EmptyState text="Cargando conversación…" />
  if (isError || !card) return <EmptyState text="No se pudo cargar la conversación" />

  const stageName =
    boards?.pipelines.flatMap((p) => p.stages).find((s) => s.id === card.stage_id)?.name ?? ''
  const showGenerateEntry = stageName === 'Pago validado' && !card.is_ai_active

  const handleToggle = (next: boolean) => {
    setAiActive.mutate({ conversationId: card.conversation_id, isAiActive: next })
  }

  return (
    <>
      <div className="border-b border-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white">
            {card.title.charAt(0).toUpperCase()}
          </div>
          <p className="min-w-0 flex-1 truncate text-sm font-bold text-white">{card.title}</p>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Cerrar conversación"
              onClick={onClose}
              className="size-8 flex-shrink-0 rounded-full text-zinc-500 hover:bg-white/5 hover:text-white"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {card.thread.length === 0 ? (
          <p className="pt-8 text-center text-xs font-normal text-zinc-600">
            Sin mensajes todavía
          </p>
        ) : (
          card.thread.map((message, idx) => (
            <ConversationMessage key={`${message.at}-${idx}`} message={message} />
          ))
        )}
      </div>

      <div className="space-y-3 border-t border-white/5 p-4">
        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <Bot
              className={cn(
                'size-4 flex-shrink-0',
                card.is_ai_active ? 'text-violet-400' : 'text-zinc-600',
              )}
            />
            <Label
              htmlFor="ai-active"
              className="cursor-pointer truncate text-xs font-normal text-zinc-300"
            >
              Agente IA <span className="text-zinc-500">(responde por vos)</span>
            </Label>
          </div>
          <Switch
            id="ai-active"
            checked={card.is_ai_active}
            onCheckedChange={handleToggle}
            disabled={!canOperateCrm || setAiActive.isPending}
            className="data-[state=checked]:bg-violet-600"
          />
        </div>

        {showGenerateEntry && (
          <Button
            onClick={() => generateEntryMutation.mutate()}
            disabled={generateEntryMutation.isPending}
            className="h-10 w-full gap-2 rounded-xl bg-gradient-to-b from-violet-500 to-violet-700 text-sm font-medium text-white hover:from-violet-400 hover:to-violet-600 disabled:opacity-60"
          >
            <QrCode className="size-4 flex-shrink-0" />
            {generateEntryMutation.isPending ? 'Generando…' : 'Generar entrada'}
          </Button>
        )}

        {/* Input humano: solo en takeover (is_ai_active=false) y con permiso. */}
        {!card.is_ai_active && canOperateCrm && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const text = reply.trim()
              if (!text || sendReply.isPending) return
              sendReply.mutate(text, { onSuccess: () => setReply('') })
            }}
            className="flex gap-2"
          >
            <Input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Escribí tu respuesta…"
              maxLength={4096}
              disabled={sendReply.isPending}
              className="h-10 flex-1 rounded-full border-white/10 bg-white/[0.03] text-sm font-normal text-white placeholder:text-zinc-600 disabled:opacity-50"
            />
            <Button
              type="submit"
              disabled={sendReply.isPending || reply.trim().length === 0}
              aria-label="Enviar"
              className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-b from-violet-500 to-violet-700 p-0 hover:from-violet-400 hover:to-violet-600 disabled:opacity-40"
            >
              <Send className="size-4" />
            </Button>
          </form>
        )}
      </div>
    </>
  )
}
