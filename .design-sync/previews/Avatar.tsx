import { Avatar, AvatarImage, AvatarFallback } from 'airsquad-ui'

// Marka nie ma jasnego motywu — patrz .design-sync/conventions.md.
const canvas = { background: 'var(--background)', padding: 24 }

// Zdjęcie profilowe symulowane jako inline SVG (data URI) — panel admina
// jeszcze nie ma realnych zdjęć trenerów wgranych do Supabase Storage, więc
// tu demonstrujemy AvatarImage bez zależności od sieci.
const trainerPhoto = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#7c4dff"/><stop offset="1" stop-color="#22d3ee"/>' +
    '</linearGradient></defs>' +
    '<rect width="96" height="96" fill="url(#g)"/>' +
    '<circle cx="48" cy="38" r="17" fill="#fff" fill-opacity="0.88"/>' +
    '<path d="M14 90c5-21 25-31 34-31s29 10 34 31" fill="#fff" fill-opacity="0.88"/>' +
    '</svg>',
)}`

export function Default() {
  return (
    <div style={canvas}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar>
          <AvatarFallback>PD</AvatarFallback>
        </Avatar>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--foreground)' }}>
            Patryk Dębski
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
            Trener prowadzący — AcroTricking PRO
          </div>
        </div>
      </div>
    </div>
  )
}

export function WithPhoto() {
  return (
    <div style={canvas}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar style={{ width: 56, height: 56 }}>
          <AvatarImage src={trainerPhoto} alt="Zdjęcie profilowe: Gabriela Cichoń" />
          <AvatarFallback>GC</AvatarFallback>
        </Avatar>
        <div>
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--foreground)' }}>
            Gabriela Cichoń
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
            Zdjęcie profilowe · edycja karty trenera
          </div>
        </div>
      </div>
    </div>
  )
}

export function Sizes() {
  return (
    <div style={{ ...canvas, display: 'flex', alignItems: 'flex-end', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <Avatar style={{ width: 24, height: 24 }}>
          <AvatarFallback style={{ fontSize: 10 }}>AS</AvatarFallback>
        </Avatar>
        <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>lista</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <Avatar>
          <AvatarFallback>ŁP</AvatarFallback>
        </Avatar>
        <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>tabela</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <Avatar style={{ width: 64, height: 64 }}>
          <AvatarFallback style={{ fontSize: 20 }}>GM</AvatarFallback>
        </Avatar>
        <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>profil</span>
      </div>
    </div>
  )
}

export function TrainerRoster() {
  const trainers = [
    { initials: 'GM', name: 'Gabriel Myśliwiec', group: 'AcroRzeszów' },
    { initials: 'PD', name: 'Patryk Dębski', group: 'AcroTricking PRO' },
    { initials: 'AS', name: 'Agnieszka Sobczyk', group: 'AcroKids · Dębica' },
  ]
  return (
    <div style={canvas}>
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 12,
          minWidth: 260,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: 0.4 }}>
          Trenerzy — sezon 2025/26
        </div>
        {trainers.map((t) => (
          <div key={t.initials} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar style={{ width: 32, height: 32 }}>
              <AvatarFallback style={{ fontSize: 12 }}>{t.initials}</AvatarFallback>
            </Avatar>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>{t.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{t.group}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
