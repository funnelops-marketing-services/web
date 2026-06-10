'use client'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateAgentConfig } from '@/hooks/use-agent-config'
import type { AgentRead, AgentUpdate } from '@/lib/api/agent-config'

interface FormValues {
  system_prompt: string
  model: string
  temperature: string
  ofertas: string
  faq: string
  change_summary: string
}

/** JSON legible para el textarea; clave ausente → vacío (no la reintroducimos). */
function toText(value: unknown): string {
  return value === undefined ? '' : JSON.stringify(value, null, 2)
}

/** Editor del agente. `config` se reemplaza completo en el server: lo reconstruimos
 *  desde el `config` cargado y solo pisamos los campos editados (preserva emojis, etc.). */
export function AgentConfigForm({ agent }: { agent: AgentRead }) {
  const mutation = useUpdateAgentConfig(agent.id)
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      system_prompt: agent.system_prompt,
      model: agent.model,
      temperature: agent.config.temperature === undefined ? '' : String(agent.config.temperature),
      ofertas: toText(agent.config.ofertas),
      faq: toText(agent.config.faq),
      change_summary: '',
    },
  })
  const { dirtyFields, isDirty } = formState

  const onSubmit = (values: FormValues) => {
    const body: AgentUpdate = {}
    if (dirtyFields.system_prompt) body.system_prompt = values.system_prompt
    if (dirtyFields.model) body.model = values.model

    if (dirtyFields.temperature || dirtyFields.ofertas || dirtyFields.faq) {
      // Spread preserves config keys the form doesn't expose (e.g. emojis): the
      // server replaces config wholesale, so we only override the edited keys.
      const config: Record<string, unknown> = { ...agent.config }
      if (dirtyFields.temperature) {
        const raw = values.temperature.trim()
        if (raw === '') {
          delete config.temperature
        } else {
          const num = Number(raw)
          if (!Number.isFinite(num)) return toast.error('La temperatura debe ser un número.')
          config.temperature = num
        }
      }
      // Cleared field → drop the key (runtime reads via .get(); absent == null).
      for (const field of ['ofertas', 'faq'] as const) {
        if (!dirtyFields[field]) continue
        const raw = values[field].trim()
        if (raw === '') {
          delete config[field]
          continue
        }
        try {
          config[field] = JSON.parse(raw)
        } catch {
          return toast.error(`JSON inválido en ${field === 'ofertas' ? 'Ofertas' : 'FAQ'}.`)
        }
      }
      body.config = config
    }

    const summary = values.change_summary.trim()
    if (summary) body.change_summary = summary

    if (Object.keys(body).length === 0) return toast.info('No hay cambios para guardar.')
    mutation.mutate(body)
  }

  const versionLabel = agent.current_version
    ? `Versión actual: v${agent.current_version.version_number}`
    : 'Sin versiones guardadas'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Agente</h1>
          <p className="text-sm text-zinc-500">{versionLabel}</p>
        </div>
        <Button
          type="submit"
          disabled={!isDirty || mutation.isPending}
          className="h-10 gap-2 rounded-xl bg-gradient-to-b from-violet-500 to-violet-700 px-5 text-sm font-medium text-white hover:from-violet-400 hover:to-violet-600 disabled:opacity-50"
        >
          {mutation.isPending ? 'Guardando…' : 'Guardar'}
        </Button>
      </div>

      <Field label="System prompt" htmlFor="system_prompt">
        <Textarea
          id="system_prompt"
          rows={8}
          {...register('system_prompt')}
          className="border-white/10 bg-white/[0.03] font-mono text-sm text-white"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Modelo" htmlFor="model">
          <Input
            id="model"
            {...register('model')}
            className="border-white/10 bg-white/[0.03] text-sm text-white"
          />
        </Field>
        <Field label="Temperatura (0–1)" htmlFor="temperature">
          <Input
            id="temperature"
            type="number"
            step="0.01"
            min="0"
            max="1"
            {...register('temperature')}
            className="border-white/10 bg-white/[0.03] text-sm text-white"
          />
        </Field>
      </div>

      <Field label="Ofertas (JSON)" htmlFor="ofertas">
        <Textarea
          id="ofertas"
          rows={6}
          {...register('ofertas')}
          className="border-white/10 bg-white/[0.03] font-mono text-sm text-white"
        />
      </Field>

      <Field label="FAQ (JSON)" htmlFor="faq">
        <Textarea
          id="faq"
          rows={6}
          {...register('faq')}
          className="border-white/10 bg-white/[0.03] font-mono text-sm text-white"
        />
      </Field>

      <Field label="Resumen del cambio" htmlFor="change_summary">
        <Input
          id="change_summary"
          maxLength={500}
          placeholder="Qué cambiaste y por qué (opcional)"
          {...register('change_summary')}
          className="border-white/10 bg-white/[0.03] text-sm text-white placeholder:text-zinc-600"
        />
      </Field>
    </form>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-xs font-medium text-zinc-400">
        {label}
      </Label>
      {children}
    </div>
  )
}
