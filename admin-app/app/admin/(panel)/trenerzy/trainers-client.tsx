'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Pencil, Trash2, MoreHorizontal, User, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { DataTable, Column } from '@/components/admin/data-table'
import { createClient } from '@/lib/supabase/client'
import type { Trainer } from '@/lib/types/database'

interface TrainersClientProps {
  initialData: Trainer[]
}

export function TrainersClient({ initialData }: TrainersClientProps) {
  const router = useRouter()
  const [trainers, setTrainers] = useState(initialData)
  const [formOpen, setFormOpen] = useState(false)
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingTrainer, setDeletingTrainer] = useState<Trainer | null>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    photo_url: '',
    instagram_url: '',
    specializations: [] as string[],
    display_order: 0,
    is_active: true,
  })

  function resetForm() {
    setFormData({
      name: '',
      role: '',
      bio: '',
      photo_url: '',
      instagram_url: '',
      specializations: [],
      display_order: 0,
      is_active: true,
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    if (editingTrainer) {
      const { data, error } = await supabase
        .from('trainers')
        .update(formData)
        .eq('id', editingTrainer.id)
        .select()
        .single()

      if (error) {
        toast.error('Blad podczas aktualizacji')
        setLoading(false)
        return
      }

      setTrainers((prev) => prev.map((t) => (t.id === data.id ? data : t)))
      toast.success('Trener zaktualizowany')
    } else {
      const { data, error } = await supabase
        .from('trainers')
        .insert(formData)
        .select()
        .single()

      if (error) {
        toast.error('Blad podczas dodawania')
        setLoading(false)
        return
      }

      setTrainers((prev) => [...prev, data])
      toast.success('Trener dodany')
    }

    setLoading(false)
    setFormOpen(false)
    setEditingTrainer(null)
    resetForm()
    router.refresh()
  }

  async function handleDelete() {
    if (!deletingTrainer) return

    const supabase = createClient()
    const { error } = await supabase.from('trainers').delete().eq('id', deletingTrainer.id)

    if (error) {
      toast.error('Blad podczas usuwania')
      return
    }

    setTrainers((prev) => prev.filter((t) => t.id !== deletingTrainer.id))
    toast.success('Trener usuniety')
    setDeleteDialogOpen(false)
    setDeletingTrainer(null)
  }

  function handleEdit(trainer: Trainer) {
    setEditingTrainer(trainer)
    setFormData({
      name: trainer.name,
      role: trainer.role || '',
      bio: trainer.bio || '',
      photo_url: trainer.photo_url || '',
      instagram_url: trainer.instagram_url || '',
      specializations: trainer.specializations || [],
      display_order: trainer.display_order,
      is_active: trainer.is_active,
    })
    setFormOpen(true)
  }

  const columns: Column<Trainer>[] = [
    {
      key: 'name',
      header: 'Trener',
      cell: (trainer) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={trainer.photo_url || ''} alt={trainer.name} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{trainer.name}</p>
            <p className="text-sm text-muted-foreground">{trainer.role || 'Trener'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'specializations',
      header: 'Specjalizacje',
      cell: (trainer) => (
        <div className="flex flex-wrap gap-1">
          {trainer.specializations?.slice(0, 3).map((spec) => (
            <Badge key={spec} variant="secondary" className="text-xs">
              {spec}
            </Badge>
          ))}
          {(trainer.specializations?.length || 0) > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{trainer.specializations!.length - 3}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (trainer) => (
        <Badge variant={trainer.is_active ? 'default' : 'secondary'}>
          {trainer.is_active ? (
            <>
              <CheckCircle className="mr-1 h-3 w-3" />
              Aktywny
            </>
          ) : (
            <>
              <XCircle className="mr-1 h-3 w-3" />
              Nieaktywny
            </>
          )}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (trainer) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(trainer)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edytuj
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setDeletingTrainer(trainer)
                setDeleteDialogOpen(true)
              }}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Usun
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trenerzy</h1>
        <p className="text-muted-foreground">Zarzadzaj zespolem trenerow</p>
      </div>

      <DataTable
        data={trainers}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Szukaj trenerow..."
        onAdd={() => {
          resetForm()
          setEditingTrainer(null)
          setFormOpen(true)
        }}
        addLabel="Dodaj trenera"
        emptyTitle="Brak trenerow"
        emptyDescription="Dodaj pierwszego trenera."
      />

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={(open) => {
        if (!open) {
          setFormOpen(false)
          setEditingTrainer(null)
          resetForm()
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTrainer ? 'Edytuj trenera' : 'Nowy trener'}</DialogTitle>
            <DialogDescription>
              {editingTrainer ? 'Zaktualizuj dane trenera.' : 'Wypelnij dane nowego trenera.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Imie i nazwisko</FieldLabel>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="role">Stanowisko</FieldLabel>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="np. Glowny Trener"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="specializations">Specjalizacje (oddzielone przecinkiem)</FieldLabel>
                <Input
                  id="specializations"
                  value={formData.specializations.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    specializations: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })}
                  placeholder="np. Akrobatyka, Tricking"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="photo_url">URL zdjecia</FieldLabel>
                <Input
                  id="photo_url"
                  type="url"
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="instagram_url">Instagram</FieldLabel>
                <Input
                  id="instagram_url"
                  type="url"
                  value={formData.instagram_url}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/..."
                />
              </Field>

              <Field className="flex items-center justify-between">
                <div>
                  <FieldLabel htmlFor="is_active">Aktywny</FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    Nieaktywni trenerzy nie sa wyswietlani na stronie
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </Field>
            </FieldGroup>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)} disabled={loading}>
                Anuluj
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Spinner className="mr-2 h-4 w-4" />}
                {editingTrainer ? 'Zapisz' : 'Dodaj'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunac trenera?</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunac trenera &quot;{deletingTrainer?.name}&quot;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Usun
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
