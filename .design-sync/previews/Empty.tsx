import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
  Button,
} from 'airsquad-ui'
import { Inbox, PackageX, Users } from 'lucide-react'

// Marka nie ma jasnego motywu — --background/--foreground zakładają ciemne
// tło strony (patrz .design-sync/conventions.md). Każda historia ustawia
// realne tło strony.
const canvas = { background: 'var(--background)', padding: 24 }

export function BrakZamowien() {
  return (
    <div style={canvas}>
      <Empty style={{ border: '1px dashed var(--border)', color: 'var(--foreground)' }}>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox />
          </EmptyMedia>
          <EmptyTitle>Brak zamówień</EmptyTitle>
          <EmptyDescription>
            Nikt jeszcze nie złożył zamówienia w sklepie klubowym w tym
            miesiącu.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}

export function BrakProduktowZAkcja() {
  return (
    <div style={canvas}>
      <Empty style={{ border: '1px dashed var(--border)', color: 'var(--foreground)' }}>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PackageX />
          </EmptyMedia>
          <EmptyTitle>Brak produktów w tej kategorii</EmptyTitle>
          <EmptyDescription>
            Koszulki i worki treningowe Air Squad pojawią się tu po dodaniu
            pierwszego produktu.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>Dodaj produkt</Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}

export function BrakWynikowWyszukiwania() {
  return (
    <div style={canvas}>
      <Empty style={{ border: '1px dashed var(--border)', color: 'var(--foreground)' }}>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Users />
          </EmptyMedia>
          <EmptyTitle>Nie znaleziono trenera</EmptyTitle>
          <EmptyDescription>
            Żaden trener nie pasuje do frazy „Sobczyk Rzeszów”. Sprawdź
            pisownię lub wyczyść filtry.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline">Wyczyść filtry</Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
