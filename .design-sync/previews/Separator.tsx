import { Separator } from 'airsquad-ui'

// Marka nie ma jasnego motywu — --background/--foreground zakładają ciemne
// tło strony (patrz .design-sync/conventions.md), więc każda historia
// ustawia realne tło strony.
const canvas = { background: 'var(--background)', padding: 24 }

export function Default() {
  return (
    <div style={{ ...canvas, maxWidth: 360 }}>
      <div style={{ color: 'var(--foreground)', fontSize: 14, marginBottom: 12 }}>
        Grupa: AcroRzeszów
      </div>
      <Separator />
      <div style={{ color: 'var(--muted-foreground)', fontSize: 14, marginTop: 12 }}>
        Trener: Gabriel Myśliwiec
      </div>
    </div>
  )
}

export function Pionowy() {
  // Wysokość podana jawnie przez style (realny prop przekazywany na
  // SeparatorPrimitive.Root) zamiast polegać na h-full: w tym środowisku
  // podglądu procentowa wysokość na pionowym separatorze w wierszu flex
  // bywa niestabilna w silniku renderującym — jawny piksel to częsty,
  // uzasadniony wzorzec dla pionowych separatorów w praktyce.
  return (
    <div style={{ ...canvas, display: 'flex', alignItems: 'center', height: 48, gap: 16 }}>
      <span style={{ color: 'var(--foreground)', fontSize: 14 }}>Rzeszów</span>
      <Separator orientation="vertical" style={{ height: 24 }} />
      <span style={{ color: 'var(--foreground)', fontSize: 14 }}>Dębica</span>
      <Separator orientation="vertical" style={{ height: 24 }} />
      <span style={{ color: 'var(--foreground)', fontSize: 14 }}>Jasło</span>
      <Separator orientation="vertical" style={{ height: 24 }} />
      <span style={{ color: 'var(--foreground)', fontSize: 14 }}>Biecz</span>
    </div>
  )
}

export function ListaTrenerow() {
  return (
    <div
      style={{
        ...canvas,
        maxWidth: 340,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '10px 0', color: 'var(--foreground)', fontSize: 14 }}>
        Gabriel Myśliwiec — akrobatyka
      </div>
      <Separator />
      <div style={{ padding: '10px 0', color: 'var(--foreground)', fontSize: 14 }}>
        Patryk Dębski — tricking
      </div>
      <Separator />
      <div style={{ padding: '10px 0', color: 'var(--foreground)', fontSize: 14 }}>
        Gabriela Cichoń — showdance
      </div>
      <Separator />
      <div style={{ padding: '10px 0', color: 'var(--foreground)', fontSize: 14 }}>
        Agnieszka Sobczyk — tumbling
      </div>
    </div>
  )
}

export function WFormularzuAdmina() {
  return (
    <div
      style={{
        ...canvas,
        maxWidth: 380,
        background: 'var(--secondary)',
        borderRadius: 12,
        border: '1px solid var(--border)',
        padding: 20,
      }}
    >
      <div style={{ color: 'var(--secondary-foreground)', fontSize: 15, fontWeight: 500 }}>
        Nowa lokalizacja
      </div>
      <div style={{ color: 'var(--muted-foreground)', fontSize: 13, marginTop: 4 }}>
        Dane podstawowe: nazwa, adres, sala
      </div>
      <Separator className="my-4" />
      <div style={{ color: 'var(--secondary-foreground)', fontSize: 15, fontWeight: 500 }}>
        Dane kontaktowe
      </div>
      <div style={{ color: 'var(--muted-foreground)', fontSize: 13, marginTop: 4 }}>
        Telefon, e-mail, trenerzy przypisani do lokalizacji
      </div>
    </div>
  )
}
