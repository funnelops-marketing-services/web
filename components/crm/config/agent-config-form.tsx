'use client'

import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useAgentModels, useUpdateAgentConfig } from '@/hooks/use-agent-config'
import type { AgentRead, AgentUpdate } from '@/lib/api/agent-config'

interface FormValues {
  display_name: string
  system_prompt: string
  model: string
  temperature: number
  emojis: boolean
}

/** Editor del agente. Modelo = dropdown del catálogo (#60); temperatura = slider 0–1;
 *  emojis = switch on/off (#61). Servicios/FAQ/Resumen salen del Catálogo (#62), no del form.
 *  `config` se reemplaza completo en el server: lo reconstruimos desde el `config` cargado
 *  para preservar las keys que el form no maneja (p. ej. `services`, server-owned). */
export function AgentConfigForm({ agent }: { agent: AgentRead }) {
  const mutation = useUpdateAgentConfig(agent.id)
  const { data: models } = useAgentModels()
  const { register, control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      display_name: agent.display_name,
      system_prompt: agent.system_prompt,
      model: agent.model,
      temperature: typeof agent.config.temperature === 'number' ? agent.config.temperature : 0.7,
      emojis: agent.config.emojis === true,
    },
  })
  const { dirtyFields, isDirty } = formState

  // El modelo guardado podría no estar en el catálogo (valor viejo): lo agregamos
  // para que el dropdown lo muestre en vez de quedar vacío.
  const options = models ?? []
  const modelOptions = options.some((m) => m.id === agent.model)
    ? options
    : [{ id: agent.model, label: agent.model }, ...options]

  const onSubmit = (values: FormValues) => {
    const body: AgentUpdate = {}
    if (dirtyFields.display_name) body.display_name = values.display_name.trim()
    if (dirtyFields.system_prompt) body.system_prompt = values.system_prompt
    if (dirtyFields.model) body.model = values.model

    if (dirtyFields.temperature || dirtyFields.emojis) {
      // Spread preserves keys the form doesn't expose (e.g. services, server-owned);
      // los nodos manuales viejos se quitan del payload (el server igual los descarta).
      const config: Record<string, unknown> = { ...agent.config }
      delete config.ofertas
      delete config.faq
      delete config.resumen
      if (dirtyFields.temperature) config.temperature = values.temperature
      if (dirtyFields.emojis) config.emojis = values.emojis
      body.config = config
    }

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
          <h1 className="text-2xl font-bold text-white">{agent.display_name}</h1>
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

      <Field label="Nombre del agente" htmlFor="display_name">
        <Input
          id="display_name"
          {...register('display_name')}
          className="border-white/10 bg-white/[0.03] text-sm text-white"
        />
      </Field>

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
          <Controller
            control={control}
            name="model"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="model"
                  className="w-full border-white/10 bg-white/[0.03] text-sm text-white"
                >
                  <SelectValue placeholder="Elegí un modelo" />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Controller
          control={control}
          name="temperature"
          render={({ field }) => (
            <Field label={`Temperatura: ${field.value.toFixed(2)}`} htmlFor="temperature">
              <Slider
                id="temperature"
                min={0}
                max={1}
                step={0.01}
                value={[field.value]}
                onValueChange={(v) => field.onChange(v[0])}
                className="py-3"
              />
            </Field>
          )}
        />
      </div>

      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div className="space-y-1">
          <Label htmlFor="emojis" className="text-sm font-medium text-white">
            Emojis
          </Label>
          <p className="text-xs text-zinc-500">El agente usa emojis en sus respuestas.</p>
        </div>
        <Controller
          control={control}
          name="emojis"
          render={({ field }) => (
            <Switch id="emojis" checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>
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
