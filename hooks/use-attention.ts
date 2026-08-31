'use client'

import { useMemo } from 'react'

import { useBoard } from '@/hooks/use-board'
import {
  collectAttention,
  countBlocking,
  type AttentionItem,
} from '@/lib/crm/attention'

export interface AttentionQueue {
  items: AttentionItem[]
  /** Cuántas no avanzan sin que alguien decida: es el número que va al contador. */
  blocking: number
  isLoading: boolean
  isError: boolean
}

/** La cola se deriva del board, no de un endpoint propio: `useBoard` ya trae todas las
 *  cards con sus avisos y React Query comparte la misma query entre pantallas, así que
 *  esto no agrega tráfico y se actualiza con el mismo realtime que el tablero. */
export function useAttention(): AttentionQueue {
  const { data, isLoading, isError } = useBoard()
  const items = useMemo(() => collectAttention(data), [data])
  return { items, blocking: countBlocking(items), isLoading, isError }
}
