import { Textarea } from 'airsquad-ui'
import { Label } from 'airsquad-ui'

// Marka nie ma jasnego motywu — --background/--foreground zakładają ciemne
// tło strony (patrz .design-sync/conventions.md). Każda historia ustawia
// realne tło strony, inaczej jasny tekst znika na białym płótnie podglądu.
const canvas = { background: 'var(--background)', padding: 24 }
const field = { display: 'flex', flexDirection: 'column' as const, gap: 6, width: 360 }

export function Default() {
  return (
    <div style={canvas}>
      <div style={field}>
        <Label htmlFor="textarea-default">Wiadomość</Label>
        <Textarea
          id="textarea-default"
          placeholder="Napisz do nas w sprawie zapisów na Air Camp…"
        />
      </div>
    </div>
  )
}

export function Filled() {
  return (
    <div style={canvas}>
      <div style={field}>
        <Label htmlFor="textarea-filled">Uwagi zdrowotne dziecka</Label>
        <Textarea
          id="textarea-filled"
          defaultValue={
            'Dziecko ma alergię na pyłki, trener grupy AcroKids 2 poinformowany. ' +
            'Poza tym brak przeciwwskazań do zajęć akrobatyki i tumblingu.'
          }
          rows={4}
        />
      </div>
    </div>
  )
}

export function Disabled() {
  return (
    <div style={canvas}>
      <div style={field}>
        <Label htmlFor="textarea-disabled">Opis wydarzenia (edytowalny tylko przez trenera)</Label>
        <Textarea
          id="textarea-disabled"
          defaultValue="Gravity Jam — impreza uliczna: rolki, akrobatyka, longboard. Szczegóły ustala Patryk Dębski."
          disabled
          rows={3}
        />
      </div>
    </div>
  )
}

export function Invalid() {
  return (
    <div style={canvas}>
      <div style={field}>
        <Label htmlFor="textarea-invalid">Opis produktu w sklepie klubowym</Label>
        <Textarea
          id="textarea-invalid"
          defaultValue=""
          placeholder="np. Bluza z kapturem AIR SQUAD, rozmiary 122–170"
          aria-invalid="true"
          rows={3}
        />
        <span style={{ fontSize: 12, color: 'var(--destructive)' }}>Opis produktu jest wymagany.</span>
      </div>
    </div>
  )
}
