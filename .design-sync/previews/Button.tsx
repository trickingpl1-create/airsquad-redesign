import { Button } from 'airsquad-ui'

// Marka nie ma jasnego motywu — --background/--foreground zakładają ciemne
// tło strony (patrz .design-sync/conventions.md). "ghost"/"link" są prawie
// niewidoczne na białym płótnie podglądu, więc każda historia ustawia
// realne tło strony.
const canvas = { background: 'var(--background)', padding: 24 }

export function Default() {
  return (
    <div style={canvas}>
      <Button>Zapisz się na zajęcia</Button>
    </div>
  )
}

export function Variants() {
  return (
    <div style={{ ...canvas, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Button variant="default">Zapisz dziecko</Button>
      <Button variant="secondary">Sprawdź grafik</Button>
      <Button variant="outline">Zobacz cennik</Button>
      <Button variant="ghost">Anuluj</Button>
      <Button variant="link">Regulamin klubu</Button>
      <Button variant="destructive">Usuń zamówienie</Button>
    </div>
  )
}

export function Sizes() {
  return (
    <div style={{ ...canvas, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
      <Button size="sm">Mały</Button>
      <Button size="default">Domyślny</Button>
      <Button size="lg">Duży</Button>
    </div>
  )
}

export function Disabled() {
  return (
    <div style={canvas}>
      <Button disabled>Zapisywanie…</Button>
    </div>
  )
}
