'use client'

import { useState, useMemo } from 'react'
import { MapPin, Clock, User, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { TrainingSession, Location, TrainingType } from '@/lib/types/database'
import { DAY_NAMES } from '@/lib/types/database'

interface ScheduleClientProps {
  sessions: (TrainingSession & {
    training_type: TrainingType | null
    location: Location | null
    trainer: { name: string } | null
  })[]
  locations: Location[]
  trainingTypes: TrainingType[]
}

function formatTime(time: string): string {
  return time.slice(0, 5)
}

export function ScheduleClient({ sessions, locations, trainingTypes }: ScheduleClientProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      if (selectedLocation !== 'all' && session.location_id !== selectedLocation) {
        return false
      }
      if (selectedType !== 'all' && session.training_type_id !== selectedType) {
        return false
      }
      return true
    })
  }, [sessions, selectedLocation, selectedType])

  const sessionsByDay = useMemo(() => {
    const grouped: Record<number, typeof filteredSessions> = {}
    filteredSessions.forEach((session) => {
      if (!grouped[session.day_of_week]) {
        grouped[session.day_of_week] = []
      }
      grouped[session.day_of_week].push(session)
    })
    return grouped
  }, [filteredSessions])

  const hasFilters = selectedLocation !== 'all' || selectedType !== 'all'

  function clearFilters() {
    setSelectedLocation('all')
    setSelectedType('all')
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Grafik zajec</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Sprawdz dostepne terminy zajec w Twojej lokalizacji. 
            Wybierz rodzaj zajec i miejsce, aby zobaczyc pasujace terminy.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filtruj:</span>
          </div>

          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Wszystkie lokalizacje" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie lokalizacje</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Wszystkie zajecia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie zajecia</SelectItem>
              {trainingTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-1 h-4 w-4" />
              Wyczysc filtry
            </Button>
          )}
        </div>

        {/* Schedule Grid */}
        {filteredSessions.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">
              Brak zajec spelniajacych wybrane kryteria.
            </p>
            {hasFilters && (
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Pokaz wszystkie zajecia
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {[1, 2, 3, 4, 5, 6, 0].map((dayIndex) => {
              const daySessions = sessionsByDay[dayIndex]
              if (!daySessions || daySessions.length === 0) return null

              return (
                <div key={dayIndex}>
                  <h2 className="mb-4 text-xl font-semibold">{DAY_NAMES[dayIndex]}</h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {daySessions.map((session) => (
                      <Card key={session.id} className="overflow-hidden">
                        <div
                          className="h-1"
                          style={{ backgroundColor: session.training_type?.color || 'var(--primary)' }}
                        />
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                {session.training_type?.name || 'Zajecia'}
                              </CardTitle>
                              {session.age_group && (
                                <CardDescription>{session.age_group}</CardDescription>
                              )}
                            </div>
                            <Badge variant="secondary">
                              {session.price_monthly
                                ? `${session.price_monthly} zl/mies.`
                                : 'Cena do ustalenia'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              {formatTime(session.start_time)} - {formatTime(session.end_time)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{session.location?.city || 'Lokalizacja'}</span>
                          </div>
                          {session.trainer && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span>{session.trainer.name}</span>
                            </div>
                          )}
                          {session.spots_total && (
                            <div className="pt-2">
                              <div className="flex items-center justify-between text-xs">
                                <span>Miejsca</span>
                                <span>
                                  {session.spots_total - session.spots_taken} / {session.spots_total}
                                </span>
                              </div>
                              <div className="mt-1 h-1.5 rounded-full bg-muted">
                                <div
                                  className="h-full rounded-full bg-primary"
                                  style={{
                                    width: `${((session.spots_total - session.spots_taken) / session.spots_total) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-muted-foreground">
            Nie widzisz pasujacego terminu? Skontaktuj sie z nami!
          </p>
          <Button size="lg" asChild>
            <a href="/kontakt">Zapisz sie na zajecia</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
