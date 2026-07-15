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
  Button,
} from 'airsquad-ui'

// Marka nie ma jasnego motywu — patrz .design-sync/conventions.md.
// AlertDialog to komponent portalowy Radix — wymuszamy stan otwarty przez
// defaultOpen na Root, inaczej podgląd byłby pusty.
const canvas = { background: 'var(--background)', padding: 24 }

export function Default() {
  return (
    <div style={canvas}>
      <AlertDialog defaultOpen>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Usuń trenera</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć trenera Gabrielę Cichoń?</AlertDialogTitle>
            <AlertDialogDescription>
              Trener zostanie odpięty od grup AcroKids i AcroJunior w Jaśle. Tej
              operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90">
              Usuń trenera
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export function UsunZamowienie() {
  return (
    <div style={canvas}>
      <AlertDialog defaultOpen>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Anuluj zamówienie</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anulować zamówienie #1042?</AlertDialogTitle>
            <AlertDialogDescription>
              Koszulka Air Squad, rozmiar 140 — klient otrzyma automatyczny e-mail o
              anulowaniu i zwrocie 89 zł.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Wróć</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90">
              Anuluj zamówienie
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export function ZakonczSezonZapisow() {
  return (
    <div style={canvas}>
      <AlertDialog defaultOpen>
        <AlertDialogTrigger asChild>
          <Button variant="secondary">Zamknij zapisy 2025/26</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Zamknąć zapisy na sezon 2025/26?</AlertDialogTitle>
            <AlertDialogDescription>
              Formularz zapisów AIPAX zniknie ze wszystkich 7 stron lokalizacji.
              Będzie można go włączyć ponownie w dowolnym momencie.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction>Zamknij zapisy</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
