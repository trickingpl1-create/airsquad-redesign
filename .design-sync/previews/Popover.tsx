import { Popover, PopoverTrigger, PopoverContent } from 'airsquad-ui'

// Marka nie ma jasnego motywu — patrz .design-sync/conventions.md.
// Popover ma cfg.overrides cardMode:"single", viewport:"360x280" — mało
// miejsca w pionie, więc każda historia trzyma treść zwięzłą i wymusza
// side="bottom" dla przewidywalnego układu w tak małym płótnie.
const canvas = { background: 'var(--background)', padding: 20 }

const btnStyle = {
  padding: '6px 12px',
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: 'var(--secondary)',
  color: 'var(--secondary-foreground)',
  fontSize: 13,
  cursor: 'default',
}

export function Default() {
  return (
    <div style={canvas}>
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <button type="button" style={btnStyle}>
            Szczegóły grupy
          </button>
        </PopoverTrigger>
        <PopoverContent side="bottom" style={{ width: 260 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--popover-foreground)' }}>
            AcroKids 2 — Rzeszów
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 4 }}>
            Trener: Agnieszka Sobczyk
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>
            10 / 12 miejsc zajętych
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function FilterForm() {
  return (
    <div style={canvas}>
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <button type="button" style={btnStyle}>
            Filtruj zamówienia
          </button>
        </PopoverTrigger>
        <PopoverContent side="bottom" style={{ width: 240 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>
              Status
              <div
                style={{
                  marginTop: 3,
                  padding: '5px 8px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  fontSize: 12,
                  color: 'var(--popover-foreground)',
                }}
              >
                Opłacone
              </div>
            </label>
            <label style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>
              Lokalizacja
              <div
                style={{
                  marginTop: 3,
                  padding: '5px 8px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  fontSize: 12,
                  color: 'var(--popover-foreground)',
                }}
              >
                Rzeszów — AIR SPACE
              </div>
            </label>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function ConfirmDelete() {
  return (
    <div style={canvas}>
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <button
            type="button"
            style={{ ...btnStyle, background: 'transparent', color: 'var(--foreground)' }}
          >
            Usuń zamówienie
          </button>
        </PopoverTrigger>
        <PopoverContent side="bottom" style={{ width: 250 }}>
          <div style={{ fontSize: 13, color: 'var(--popover-foreground)' }}>
            Usunąć zamówienie #1042 (koszulka, rozm. 140)? Tej operacji nie można cofnąć.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <span
              style={{
                padding: '5px 10px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                fontSize: 12,
                color: 'var(--popover-foreground)',
              }}
            >
              Anuluj
            </span>
            <span
              style={{
                padding: '5px 10px',
                borderRadius: 6,
                background: 'var(--destructive, #dc2626)',
                color: '#fff',
                fontSize: 12,
              }}
            >
              Usuń
            </span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
