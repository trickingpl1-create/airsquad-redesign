'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { createClient } from '@/lib/supabase/client'
import type { Location } from '@/lib/types/database'

interface LocationFormProps {
  open: boolean
  onClose: () => void
  onSuccess: (location: Location) => void
  location?: Location | null
}

export function LocationForm({ open, onClose, onSuccess, location }: LocationFormProps) {
  const isEditing = !!location

  const [formData, setFormData] = useState({
    name: location?.name || '',
    city: location?.city || '',
    address: location?.address || '',
    description: location?.description || '',
    maps_url: location?.maps_url || '',
    image_url: location?.image_url || '',
    display_order: location?.display_order || 0,
    is_active: location?.is_active ?? true,
  })
  const [loading, setLoading] = useState(false)

  function resetForm() {
    setFormData({
      name: '',
      city: '',
      address: '',
      description: '',
      maps_url: '',
      image_url: '',
      display_order: 0,
      is_active: true,
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    if (isEditing && location) {
      const { data, error } = await supabase
        .from('locations')
        .update(formData)
        .eq('id', location.id)
        .select()
        .single()

      if (error) {
        toast.error('Blad podczas aktualizacji lokalizacji')
        setLoading(false)
        return
      }

      toast.success('Lokalizacja zaktualizowana')
      onSuccess(data)
    } else {
      const { data, error } = await supabase
        .from('locations')
        .insert(formData)
        .select()
        .single()

      if (error) {
        toast.error('Blad podczas dodawania lokalizacji')
        setLoading(false)
        return
      }

      toast.success('Lokalizacja dodana')
      resetForm()
      onSuccess(data)
    }

    setLoading(false)
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      resetForm()
      onClose()
    }
  }

  // Reset form when location changes
  if (location && formData.name !== location.name) {
    setFormData({
      name: location.name,
      city: location.city,
      address: location.address || '',
      description: location.description || '',
      maps_url: location.maps_url || '',
      image_url: location.image_url || '',
      display_order: location.display_order,
      is_active: location.is_active,
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edytuj lokalizacje' : 'Nowa lokalizacja'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Zaktualizuj dane lokalizacji.'
              : 'Wypelnij dane nowej lokalizacji.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nazwa</FieldLabel>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="np. Air Squad Rzeszow"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="city">Miasto</FieldLabel>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="np. Rzeszow"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="address">Adres</FieldLabel>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="np. ul. Sportowa 15"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Opis</FieldLabel>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Krotki opis lokalizacji..."
                rows={3}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="maps_url">Link do Google Maps</FieldLabel>
              <Input
                id="maps_url"
                type="url"
                value={formData.maps_url}
                onChange={(e) => setFormData({ ...formData, maps_url: e.target.value })}
                placeholder="https://maps.google.com/..."
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="image_url">URL zdjecia</FieldLabel>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="display_order">Kolejnosc wyswietlania</FieldLabel>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              />
            </Field>

            <Field className="flex items-center justify-between">
              <div>
                <FieldLabel htmlFor="is_active">Aktywna</FieldLabel>
                <p className="text-sm text-muted-foreground">
                  Nieaktywne lokalizacje nie sa wyswietlane na stronie
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
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Anuluj
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  {isEditing ? 'Zapisywanie...' : 'Dodawanie...'}
                </>
              ) : isEditing ? (
                'Zapisz zmiany'
              ) : (
                'Dodaj lokalizacje'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
