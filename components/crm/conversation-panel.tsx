'use client'

import { useState } from 'react'
import { Bot, Lock, MessageSquare, Send } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useCard } from '@/hooks/use-card'
import { useSetAiActive } from '@/hooks/use-card-mutations'
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

/** Panel derecho: hilo espejo + toggle IA + input humano (bloqueado por M-Meta). */
export function ConversationPanel({ cardId }: { cardId: string | null }) {
  const { data: card, isLoading, isError } = useCard(cardId)
  const { canOperateCrm } = usePermissions()
  const setAiActive = useSetAiActive()

  // El contrato de lectura (GET /cards/{id}) aún no expone `is_ai_active`
  // (SPEC_CRM_FRONT §8): sembramos "activo" y reflejamos lo que confirma el PUT.
  // El reset por card lo da el `key` en el padre (remonta), no un efecto.
  const [aiActive, setAiActiveState] = useState(true)

  if (!cardId) return <EmptyState text="Seleccioná un lead para ver la conversación" />
  if (isLoading) return <EmptyState text="Cargando conversación…" />
  if (isError || !card) return <EmptyState text="No se pudo cargar la conversación" />

  const handleToggle = (next: boolean) => {
    setAiActiveState(next)
    setAiActive.mutate(
      { conversationId: card.conversation_id, isAiActive: next },
      {
        onSuccess: (data) => setAiActiveState(data.is_ai_active),
        onError: () => setAiActiveState(!next),
      },
    )
  }

  return (
    <>
      <div className="border-b border-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white">
            {card.title.charAt(0).toUpperCase()}
          </div>
          <p className="truncate text-sm font-bold text-white">{card.title}</p>
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
                aiActive ? 'text-violet-400' : 'text-zinc-600',
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
            checked={aiActive}
            onCheckedChange={handleToggle}
            disabled={!canOperateCrm || setAiActive.isPending}
            className="data-[state=checked]:bg-violet-600"
          />
        </div>

        {/* Input humano: visible pero deshabilitado — envío por WhatsApp
            bloqueado por M-Meta-inv (SPEC_CRM_FRONT §5/§8). */}
        <div className="flex gap-2">
          <Input
            placeholder="Respuesta humana — disponible al integrar WhatsApp"
            disabled
            className="h-10 flex-1 cursor-not-allowed rounded-full border-white/10 bg-white/[0.03] text-sm font-normal text-white opacity-50 placeholder:text-zinc-600"
          />
          <Button
            disabled
            aria-label="Enviar (no disponible)"
            className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-b from-violet-500 to-violet-700 p-0 opacity-30"
          >
            <Send className="size-4" />
          </Button>
        </div>
        <p className="flex items-center gap-1.5 text-[10px] font-normal text-zinc-600">
          <Lock className="size-2.5" />
          La respuesta humana se habilita al integrar la API de WhatsApp.
        </p>
      </div>
    </>
  )
}
