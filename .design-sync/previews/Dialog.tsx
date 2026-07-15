import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Input,
  Label,
} from 'airsquad-ui'

// Marka nie ma jasnego motywu — patrz .design-sync/conventions.md.
// Dialog to komponent portalowy Radix — wymuszamy stan otwarty przez
// defaultOpen na Root, inaczej podgląd byłby pusty.
const canvas = { background: 'var(--background)', padding: 24 }

export function Default() {
  return (
    <div style={canvas}>
      <Dialog defaultOpen>
        <DialogTrigger asChild>
          <Button variant="outline">Edytuj trenera</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edytuj trenera</DialogTitle>
            <DialogDescription>
              Dane widoczne na stronach grup treningowych Air Squad.
            </DialogDescription>
          </DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Label htmlFor="trainer-name">Imię i nazwisko</Label>
              <Input id="trainer-name" defaultValue="Patryk Dębski" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Label htmlFor="trainer-spec">Specjalizacja</Label>
              <Input id="trainer-spec" defaultValue="Tricking, AcroTricking PRO" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Label htmlFor="trainer-city">Lokalizacja</Label>
              <Input id="trainer-city" defaultValue="Rzeszów — sala AIR SPACE" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Anuluj</Button>
            </DialogClose>
            <Button>Zapisz zmiany</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function NowaLokalizacja() {
  return (
    <div style={canvas}>
      <Dialog defaultOpen>
        <DialogTrigger asChild>
          <Button>Dodaj lokalizację</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nowa lokalizacja</DialogTitle>
            <DialogDescription>
              Dodaj kolejne miasto do listy sal treningowych Air Squad.
            </DialogDescription>
          </DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Label htmlFor="city-name">Miasto</Label>
              <Input id="city-name" placeholder="np. Tyczyn" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Label htmlFor="city-addr">Adres sali</Label>
              <Input id="city-addr" placeholder="ul. Sportowa 3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Anuluj</Button>
            </DialogClose>
            <Button>Utwórz lokalizację</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function BezPrzyciskuZamkniecia() {
  return (
    <div style={canvas}>
      <Dialog defaultOpen>
        <DialogTrigger asChild>
          <Button variant="secondary">Importuj zawodników z AIPAX</Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Import zawodników z AIPAX</DialogTitle>
            <DialogDescription>
              Trwa synchronizacja zapisów z systemem AIPAX. Nie zamykaj tego okna —
              proces może potrwać do minuty.
            </DialogDescription>
          </DialogHeader>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--muted-foreground)' }}>
            Pobrano 214 z ok. 260 rekordów — grupa AcroKids 2, Dębica.
          </p>
          <DialogFooter>
            <Button disabled>Importowanie…</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
