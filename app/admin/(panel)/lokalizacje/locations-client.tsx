'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Pencil, Trash2, MoreHorizontal, MapPin, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { DataTable, Column } from '@/components/admin/data-table'
import { LocationForm } from './location-form'
import { createClient } from '@/lib/supabase/client'
import type { Location } from '@/lib/types/database'

interface LocationsClientProps {
  initialData: Location[]
}

export function LocationsClient({ initialData }: LocationsClientProps) {
  const router = useRouter()
  const [locations, setLocations] = useState(initialData)
  const [formOpen, setFormOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingLocation, setDeletingLocation] = useState<Location | null>(null)

  async function handleDelete() {
    if (!deletingLocation) return

    const supabase = createClient()
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', deletingLocation.id)

    if (error) {
      toast.error('Blad podczas usuwania lokalizacji')
      return
    }

    setLocations((prev) => prev.filter((l) => l.id !== deletingLocation.id))
    toast.success('Lokalizacja usunieta')
    setDeleteDialogOpen(false)
    setDeletingLocation(null)
  }

  function handleEdit(location: Location) {
    setEditingLocation(location)
    setFormOpen(true)
  }

  function handleFormClose() {
    setFormOpen(false)
    setEditingLocation(null)
  }

  function handleFormSuccess(location: Location) {
    if (editingLocation) {
      setLocations((prev) =>
        prev.map((l) => (l.id === location.id ? location : l))
      )
    } else {
      setLocations((prev) => [...prev, location])
    }
    handleFormClose()
    router.refresh()
  }

  const columns: Column<Location>[] = [
    {
      key: 'name',
      header: 'Nazwa',
      cell: (location) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">{location.name}</p>
            <p className="text-sm text-muted-foreground">{location.city}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'address',
      header: 'Adres',
      cell: (location) => (
        <span className="text-muted-foreground">{location.address || '-'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (location) => (
        <Badge variant={location.is_active ? 'default' : 'secondary'}>
          {location.is_active ? (
            <>
              <CheckCircle className="mr-1 h-3 w-3" />
              Aktywna
            </>
          ) : (
            <>
              <XCircle className="mr-1 h-3 w-3" />
              Nieaktywna
            </>
          )}
        </Badge>
      ),
    },
    {
      key: 'order',
      header: 'Kolejnosc',
      cell: (location) => (
        <span className="text-muted-foreground">{location.display_order}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (location) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Akcje</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(location)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edytuj
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setDeletingLocation(location)
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lokalizacje</h1>
        <p className="text-muted-foreground">
          Zarzadzaj lokalizacjami sal treningowych
        </p>
      </div>

      {/* Data Table */}
      <DataTable
        data={locations}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Szukaj lokalizacji..."
        onAdd={() => setFormOpen(true)}
        addLabel="Dodaj lokalizacje"
        emptyTitle="Brak lokalizacji"
        emptyDescription="Dodaj pierwsza lokalizacje, aby rozpoczac."
      />

      {/* Form Dialog */}
      <LocationForm
        open={formOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        location={editingLocation}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunac lokalizacje?</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunac lokalizacje &quot;{deletingLocation?.name}&quot;?
              Ta operacja jest nieodwracalna.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Usun
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
