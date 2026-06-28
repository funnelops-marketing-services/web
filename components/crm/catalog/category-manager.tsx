'use client'

import { useState } from 'react'
import { Check, Pencil, Plus, Tags, Trash2, X } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  useCreateServiceCategory,
  useDeleteServiceCategory,
  useServiceCategories,
  useUpdateServiceCategory,
} from '@/hooks/use-catalogo'
import type { ServiceCategoryRead } from '@/lib/api/catalogo'

export function CategoryManager() {
  const { data: categories, isLoading } = useServiceCategories()
  const create = useCreateServiceCategory()
  const [newName, setNewName] = useState('')

  function add() {
    const nombre = newName.trim()
    if (!nombre) return
    create.mutate({ nombre, orden: categories?.length ?? 0 }, { onSuccess: () => setNewName('') })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-white/10 bg-white/[0.03] text-white">
          <Tags className="size-4" /> Categorías
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Categorías del catálogo</DialogTitle>
          <DialogDescription>
            Agrupan los servicios. Al borrar una, sus servicios quedan sin categoría.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1">
          {isLoading && <p className="text-sm text-zinc-500">Cargando…</p>}
          {categories?.length === 0 && (
            <p className="text-sm text-zinc-500">Todavía no hay categorías.</p>
          )}
          {categories?.map((category) => <CategoryRow key={category.id} category={category} />)}
        </div>

        <div className="flex gap-2 border-t border-white/5 pt-3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="Nueva categoría"
            className="border-white/10 bg-white/[0.03] text-sm text-white"
          />
          <Button
            onClick={add}
            disabled={create.isPending || !newName.trim()}
            className="gap-2 bg-gradient-to-b from-violet-500 to-violet-700 text-white"
          >
            <Plus className="size-4" /> Agregar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CategoryRow({ category }: { category: ServiceCategoryRead }) {
  const update = useUpdateServiceCategory()
  const remove = useDeleteServiceCategory()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(category.nombre)

  function save() {
    const nombre = name.trim()
    if (!nombre || nombre === category.nombre) {
      setEditing(false)
      return
    }
    update.mutate(
      { categoryId: category.id, body: { nombre } },
      { onSuccess: () => setEditing(false) },
    )
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') save()
            if (e.key === 'Escape') setEditing(false)
          }}
          className="h-8 border-white/10 bg-white/[0.03] text-sm text-white"
        />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Guardar"
          onClick={save}
          className="size-8 text-emerald-400"
        >
          <Check className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Cancelar"
          onClick={() => {
            setName(category.nombre)
            setEditing(false)
          }}
          className="size-8 text-zinc-400"
        >
          <X className="size-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-white/[0.02]">
      <span className="truncate text-sm text-zinc-200">{category.nombre}</span>
      <div className="flex shrink-0">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Renombrar"
          onClick={() => {
            setName(category.nombre)
            setEditing(true)
          }}
          className="size-8 text-zinc-400 hover:text-white"
        >
          <Pencil className="size-3.5" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Eliminar"
              className="size-8 text-zinc-400 hover:text-red-400"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-zinc-950 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                ¿Eliminar “{category.nombre}”?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Los servicios de esta categoría quedarán sin categoría (no se eliminan).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-white/10 bg-white/[0.03] text-white">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => remove.mutate(category.id)}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
