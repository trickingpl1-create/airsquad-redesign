import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Button,
  Input,
  Label,
} from 'airsquad-ui'

// Marka nie ma jasnego motywu — patrz .design-sync/conventions.md.
// Sheet to komponent portalowy Radix — wymuszamy stan otwarty przez
// defaultOpen na Root, inaczej podgląd byłby pusty.
const canvas = { background: 'var(--background)', padding: 24 }

export function Default() {
  return (
    <div style={canvas}>
      <Sheet defaultOpen>
        <SheetTrigger asChild>
          <Button variant="outline">Filtruj zamówienia</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Filtruj zamówienia</SheetTitle>
            <SheetDescription>
              Zawęź listę zamówień sklepu Air Squad wg miasta i statusu.
            </SheetDescription>
          </SheetHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Label htmlFor="filter-city">Lokalizacja</Label>
              <Input id="filter-city" defaultValue="Rzeszów" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Label htmlFor="filter-status">Status płatności</Label>
              <Input id="filter-status" defaultValue="Oczekuje" />
            </div>
          </div>
          <SheetFooter>
            <Button>Zastosuj filtry</Button>
            <SheetClose asChild>
              <Button variant="outline">Anuluj</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export function Nawigacja() {
  return (
    <div style={canvas}>
      <Sheet defaultOpen>
        <SheetTrigger asChild>
          <Button variant="secondary">Menu panelu</Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Panel Air Squad</SheetTitle>
            <SheetDescription>Zarządzanie klubem</SheetDescription>
          </SheetHeader>
          <nav style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', gap: 4 }}>
            {['Lokalizacje', 'Trenerzy', 'Obozy i wydarzenia', 'Sklep', 'Zamówienia', 'Posty Instagram'].map(
              (item) => (
                <div
                  key={item}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 6,
                    fontSize: 14,
                    color: 'var(--foreground)',
                    background: item === 'Trenerzy' ? 'var(--accent)' : 'transparent',
                  }}
                >
                  {item}
                </div>
              ),
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export function SzybkiPodglad() {
  return (
    <div style={canvas}>
      <Sheet defaultOpen>
        <SheetTrigger asChild>
          <Button variant="outline">Podgląd grupy</Button>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>AcroTricking PRO — Rzeszów</SheetTitle>
            <SheetDescription>
              Trener: Łukasz Pacocha · sala AIR SPACE, ul. Boya-Żeleńskiego 15
            </SheetDescription>
          </SheetHeader>
          <div style={{ padding: '0 16px 16px', fontSize: 14, color: 'var(--muted-foreground)' }}>
            16 zawodników · wtorki i czwartki 18:00–19:30 · 2 wolne miejsca
          </div>
          <SheetFooter>
            <Button>Otwórz listę zawodników</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
