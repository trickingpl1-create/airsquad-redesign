import { Badge } from 'airsquad-ui'

// Marka nie ma jasnego motywu — --background/--foreground zakładają ciemne
// tło strony (patrz .design-sync/conventions.md), więc każda historia
// ustawia realne tło strony.
const canvas = { background: 'var(--background)', padding: 24 }

export function Default() {
  return (
    <div style={canvas}>
      <Badge>AcroKids</Badge>
    </div>
  )
}

export function Variants() {
  return (
    <div style={{ ...canvas, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Badge variant="default">Zapisy otwarte</Badge>
      <Badge variant="secondary">Rzeszów</Badge>
      <Badge variant="destructive">Brak miejsc</Badge>
      <Badge variant="outline">AcroTricking PRO</Badge>
    </div>
  )
}

export function ListaGrup() {
  return (
    <div
      style={{
        ...canvas,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        maxWidth: 360,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '10px 12px',
          borderRadius: 8,
          background: 'var(--secondary)',
        }}
      >
        <span style={{ color: 'var(--secondary-foreground)', fontSize: 14 }}>
          AcroKids 2 — sala AIR SPACE
        </span>
        <Badge variant="default">Zapisy otwarte</Badge>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '10px 12px',
          borderRadius: 8,
          background: 'var(--secondary)',
        }}
      >
        <span style={{ color: 'var(--secondary-foreground)', fontSize: 14 }}>
          AcroJunior — Dębica
        </span>
        <Badge variant="destructive">Brak miejsc</Badge>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '10px 12px',
          borderRadius: 8,
          background: 'var(--secondary)',
        }}
      >
        <span style={{ color: 'var(--secondary-foreground)', fontSize: 14 }}>
          AcroTricking — Jasło
        </span>
        <Badge variant="outline">Lista rezerwowa</Badge>
      </div>
    </div>
  )
}

export function ZIkonaStatusu() {
  return (
    <div style={{ ...canvas, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Badge variant="default">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M20 6L9 17l-5-5" />
        </svg>
        Opłacone
      </Badge>
      <Badge variant="destructive">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
        Nieopłacone
      </Badge>
    </div>
  )
}
