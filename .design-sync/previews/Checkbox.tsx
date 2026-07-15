import * as React from 'react'
import { Checkbox, Label } from 'airsquad-ui'

// Marka nie ma jasnego motywu — --background/--foreground zakładają ciemne
// tło strony. Każda historia ustawia realne tło strony.
const canvas = { background: 'var(--background)', padding: 24 }

export function Default() {
  return (
    <div style={canvas}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Checkbox id="checkbox-default" />
        <Label htmlFor="checkbox-default">
          Wyrażam zgodę na przetwarzanie danych osobowych dziecka
        </Label>
      </div>
    </div>
  )
}

export function Checked() {
  return (
    <div style={canvas}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Checkbox id="checkbox-checked" defaultChecked />
        <Label htmlFor="checkbox-checked">Publikuj post na stronie głównej</Label>
      </div>
    </div>
  )
}

export function LocationsGroup() {
  const locations = [
    { id: 'loc-rzeszow', label: 'Rzeszów — sala AIR SPACE', checked: true },
    { id: 'loc-debica', label: 'Dębica', checked: true },
    { id: 'loc-jaslo', label: 'Jasło', checked: false },
    { id: 'loc-biecz', label: 'Biecz', checked: false },
    { id: 'loc-brzostek', label: 'Brzostek', checked: false },
    { id: 'loc-pilzno', label: 'Pilzno', checked: false },
    { id: 'loc-tyczyn', label: 'Tyczyn', checked: false },
  ]
  return (
    <div style={canvas}>
      <div style={{ maxWidth: 280 }}>
        <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 500, opacity: 0.8 }}>
          Lokalizacje trenera — Patryk Dębski
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {locations.map((loc) => (
            <div key={loc.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Checkbox id={loc.id} defaultChecked={loc.checked} />
              <Label htmlFor={loc.id}>{loc.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Disabled() {
  return (
    <div style={canvas}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Checkbox id="checkbox-disabled-checked" defaultChecked disabled />
          <Label htmlFor="checkbox-disabled-checked">
            Grupa zamknięta — brak wolnych miejsc
          </Label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Checkbox id="checkbox-disabled-unchecked" disabled />
          <Label htmlFor="checkbox-disabled-unchecked">
            AcroTricking PRO — wymaga kwalifikacji trenera
          </Label>
        </div>
      </div>
    </div>
  )
}

export function Invalid() {
  return (
    <div style={canvas}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 320 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Checkbox id="checkbox-invalid" aria-invalid required />
          <Label htmlFor="checkbox-invalid">
            Akceptuję regulamin zajęć Air Squad
          </Label>
        </div>
        <p style={{ margin: '0 0 0 24px', fontSize: 12, color: 'var(--destructive)' }}>
          To pole jest wymagane, aby wysłać zgłoszenie.
        </p>
      </div>
    </div>
  )
}
