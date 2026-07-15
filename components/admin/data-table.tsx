'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Plus } from 'lucide-react'
import { useState } from 'react'

export interface Column<T> {
  key: string
  header: string
  cell: (item: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchPlaceholder?: string
  searchKey?: keyof T
  onAdd?: () => void
  addLabel?: string
  emptyTitle?: string
  emptyDescription?: string
  loading?: boolean
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchPlaceholder = 'Szukaj...',
  searchKey,
  onAdd,
  addLabel = 'Dodaj',
  emptyTitle = 'Brak danych',
  emptyDescription = 'Nie znaleziono zadnych elementow.',
  loading = false,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = searchKey
    ? data.filter((item) => {
        const value = item[searchKey]
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchQuery.toLowerCase())
        }
        return true
      })
    : data

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="rounded-lg border">
          <div className="space-y-4 p-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        {searchKey && (
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        )}
        {onAdd && (
          <Button onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            {addLabel}
          </Button>
        )}
      </div>

      {/* Table */}
      {filteredData.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8">
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{emptyTitle}</EmptyTitle>
              <EmptyDescription>{emptyDescription}</EmptyDescription>
            </EmptyHeader>
            {onAdd && (
              <EmptyContent>
                <Button onClick={onAdd}>
                  <Plus className="mr-2 h-4 w-4" />
                  {addLabel}
                </Button>
              </EmptyContent>
            )}
          </Empty>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key}>{column.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>{column.cell(item)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Results count */}
      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          Znaleziono {filteredData.length} z {data.length} wynikow
        </p>
      )}
    </div>
  )
}
