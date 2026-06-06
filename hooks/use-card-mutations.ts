'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  moveCard,
  setAiActive,
  type Boards,
  type Card,
} from '@/lib/api/crm'
import { boardKeys } from '@/hooks/use-board'

interface MoveArgs {
  cardId: string
  stageId: string
}

interface MoveContext {
  previous?: Boards
}

/** Mueve `cardId` al `stageId` reasignando su stage en el cache (inmutable). */
function applyMove(boards: Boards, cardId: string, stageId: string): Boards {
  let moved: Card | undefined
  for (const pipeline of boards.pipelines) {
    for (const stage of pipeline.stages) {
      const found = stage.cards.find((c) => c.id === cardId)
      if (found) {
        moved = { ...found, stage_id: stageId }
        break
      }
    }
    if (moved) break
  }
  if (!moved) return boards

  const card = moved
  return {
    pipelines: boards.pipelines.map((pipeline) => ({
      ...pipeline,
      stages: pipeline.stages.map((stage) => {
        const without = stage.cards.filter((c) => c.id !== cardId)
        return stage.id === stageId
          ? { ...stage, cards: [...without, card] }
          : { ...stage, cards: without }
      }),
    })),
  }
}

/** Mover card entre stages (POST move) con update optimista + rollback. */
export function useMoveCard() {
  const queryClient = useQueryClient()

  return useMutation<Card, Error, MoveArgs, MoveContext>({
    mutationFn: ({ cardId, stageId }) => moveCard(cardId, stageId),
    onMutate: async ({ cardId, stageId }) => {
      await queryClient.cancelQueries({ queryKey: boardKeys.all })
      const previous = queryClient.getQueryData<Boards>(boardKeys.all)
      if (previous) {
        queryClient.setQueryData<Boards>(
          boardKeys.all,
          applyMove(previous, cardId, stageId),
        )
      }
      return { previous }
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(boardKeys.all, context.previous)
      }
      toast.error('No se pudo mover la tarjeta. Reintentá.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all })
    },
  })
}

interface AiActiveArgs {
  conversationId: string
  isAiActive: boolean
}

/** Toggle IA por conversación (PUT ai-active). El backend confirma el valor. */
export function useSetAiActive() {
  return useMutation({
    mutationFn: ({ conversationId, isAiActive }: AiActiveArgs) =>
      setAiActive(conversationId, isAiActive),
    onError: () => {
      toast.error('No se pudo cambiar el estado del agente IA.')
    },
  })
}
