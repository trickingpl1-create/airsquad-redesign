import { Sticker } from 'airsquad-ui'

// Marka nie ma jasnego motywu — --background/--foreground zakładają ciemne
// tło strony (patrz .design-sync/conventions.md), więc każda historia
// ustawia realne tło strony.
const canvas = { background: 'var(--background)', padding: 24 }

export function Default() {
  return (
    <div style={canvas}>
      <Sticker>Air Camp 2026</Sticker>
    </div>
  )
}

export function Warianty() {
  return (
    <div style={{ ...canvas, display: 'flex', flexWrap: 'wrap', gap: 20 }}>
      <Sticker variant="primary">Nowość</Sticker>
      <Sticker variant="accent">Gravity Jam</Sticker>
      <Sticker variant="cyan">Zapisy trwają</Sticker>
      <Sticker variant="dark">Sezon 2025/26</Sticker>
      <Sticker variant="white">Sklep klubowy</Sticker>
    </div>
  )
}

export function Rozmiary() {
  return (
    <div style={{ ...canvas, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20 }}>
      <Sticker size="sm">Rzeszów</Sticker>
      <Sticker size="md">Dębica</Sticker>
      <Sticker size="lg">Jasło</Sticker>
    </div>
  )
}

export function NaKarcieWydarzenia() {
  return (
    <div style={{ ...canvas, display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          position: 'relative',
          width: 320,
          borderRadius: 16,
          overflow: 'visible',
          background: 'var(--secondary)',
          border: '1px solid var(--border)',
          padding: 20,
        }}
      >
        <div style={{ position: 'absolute', top: -14, right: -10 }}>
          <Sticker variant="accent" rotate={8}>
            Zapisy!
          </Sticker>
        </div>
        <h3
          style={{
            color: 'var(--secondary-foreground)',
            fontSize: 20,
            margin: 0,
            marginBottom: 6,
          }}
        >
          Gravity Jam 2026
        </h3>
        <p style={{ color: 'var(--muted-foreground)', fontSize: 14, margin: 0 }}>
          Rolki, akrobatyka i longboard na ulicach Rzeszowa — sierpień 2026.
        </p>
      </div>
    </div>
  )
}
