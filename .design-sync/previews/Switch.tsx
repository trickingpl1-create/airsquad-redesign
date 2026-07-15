import * as React from 'react'
import { Switch, Label } from 'airsquad-ui'

// Marka nie ma jasnego motywu — --background/--foreground zakładają ciemne
// tło strony. Każda historia ustawia realne tło strony.
const canvas = { background: 'var(--background)', padding: 24 }

export function Default() {
  return (
    <div style={canvas}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Switch id="switch-default" />
        <Label htmlFor="switch-default">Aktywna promocja</Label>
      </div>
    </div>
  )
}

export function Checked() {
  return (
    <div style={canvas}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Switch id="switch-checked" defaultChecked />
        <Label htmlFor="switch-checked">Widoczny na stronie głównej</Label>
      </div>
    </div>
  )
}

export function Disabled() {
  return (
    <div style={canvas}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Switch id="switch-disabled-on" defaultChecked disabled />
          <Label htmlFor="switch-disabled-on">Zapisy otwarte (sterowane przez AIPAX)</Label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Switch id="switch-disabled-off" disabled />
          <Label htmlFor="switch-disabled-off">Sezon 2024/25 — archiwalny</Label>
        </div>
      </div>
    </div>
  )
}

export function SettingsList() {
  const settings = [
    { id: 'set-email', label: 'Powiadomienia e-mail o nowych zapisach', checked: true },
    { id: 'set-newsletter', label: 'Newsletter dla rodziców', checked: false },
    { id: 'set-ig', label: 'Auto-publikacja postów z Instagrama', checked: true },
  ]
  return (
    <div style={canvas}>
      <div style={{ maxWidth: 320 }}>
        <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 500, opacity: 0.8 }}>
          Ustawienia panelu — konto administratora
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {settings.map((s) => (
            <div
              key={s.id}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
            >
              <Label htmlFor={s.id}>{s.label}</Label>
              <Switch id={s.id} defaultChecked={s.checked} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
