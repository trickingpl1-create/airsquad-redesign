import { Tooltip, TooltipTrigger, TooltipContent } from 'airsquad-ui'

// Marka nie ma jasnego motywu — patrz .design-sync/conventions.md.
// Tooltip ma cfg.overrides cardMode:"single", viewport:"320x180" — bardzo
// mało miejsca, więc każda historia trzyma treść w jednej krótkiej linii i
// wymusza side="bottom", żeby dymek nie próbował wyjść ponad górną krawędź
// płótna (domyślny side Radixa to "top").
const canvas = { background: 'var(--background)', padding: 20 }

export function Default() {
  return (
    <div style={canvas}>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <button
            type="button"
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              border: '1px solid var(--border)',
              background: 'var(--secondary)',
              color: 'var(--secondary-foreground)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'default',
            }}
          >
            i
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Limit grupy: 12 dzieci</TooltipContent>
      </Tooltip>
    </div>
  )
}

export function OnDisabledAction() {
  return (
    <div style={canvas}>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <button
            type="button"
            disabled
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: 'none',
              background: 'var(--muted)',
              color: 'var(--muted-foreground)',
              fontSize: 13,
              cursor: 'not-allowed',
            }}
          >
            Zapisz grupę
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Uzupełnij termin zajęć przed zapisem</TooltipContent>
      </Tooltip>
    </div>
  )
}

export function OnStatusBadge() {
  return (
    <div style={canvas}>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '3px 10px',
              borderRadius: 999,
              background: 'var(--accent)',
              color: 'var(--accent-foreground)',
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            Oczekuje
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">Czeka na potwierdzenie płatności z AIPAX</TooltipContent>
      </Tooltip>
    </div>
  )
}
