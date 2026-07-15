import * as React from 'react'
import { RadioGroup, RadioGroupItem, Label } from 'airsquad-ui'

// Marka nie ma jasnego motywu — --background/--foreground zakładają ciemne
// tło strony. Każda historia ustawia realne tło strony.
const canvas = { background: 'var(--background)', padding: 24 }

export function Default() {
  return (
    <div style={canvas}>
      <div style={{ maxWidth: 260 }}>
        <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 500, opacity: 0.8 }}>
          Status zamówienia #1042
        </p>
        <RadioGroup defaultValue="oplacone">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RadioGroupItem id="status-nowe" value="nowe" />
            <Label htmlFor="status-nowe">Nowe</Label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RadioGroupItem id="status-oplacone" value="oplacone" />
            <Label htmlFor="status-oplacone">Opłacone</Label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RadioGroupItem id="status-wyslane" value="wyslane" />
            <Label htmlFor="status-wyslane">Wysłane</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

export function Sizes() {
  return (
    <div style={canvas}>
      <div style={{ maxWidth: 260 }}>
        <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 500, opacity: 0.8 }}>
          Rozmiar — koszulka klubowa Air Squad
        </p>
        <RadioGroup defaultValue="140">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RadioGroupItem id="size-128" value="128" />
            <Label htmlFor="size-128">128 cm</Label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RadioGroupItem id="size-140" value="140" />
            <Label htmlFor="size-140">140 cm</Label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RadioGroupItem id="size-152" value="152" />
            <Label htmlFor="size-152">152 cm</Label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RadioGroupItem id="size-164" value="164" />
            <Label htmlFor="size-164">164 cm</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

export function Disabled() {
  return (
    <div style={canvas}>
      <div style={{ maxWidth: 260 }}>
        <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 500, opacity: 0.8 }}>
          Grupa treningowa — zapisy zamknięte dla PRO
        </p>
        <RadioGroup defaultValue="acrojunior">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RadioGroupItem id="group-kids" value="acrokids" />
            <Label htmlFor="group-kids">AcroKids</Label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RadioGroupItem id="group-junior" value="acrojunior" />
            <Label htmlFor="group-junior">AcroJunior</Label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RadioGroupItem id="group-pro" value="acropro" disabled />
            <Label htmlFor="group-pro">AcroTricking PRO — brak miejsc</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

export function MainLocation() {
  return (
    <div style={canvas}>
      <div style={{ maxWidth: 280 }}>
        <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 500, opacity: 0.8 }}>
          Główna lokalizacja trenera — Gabriela Cichoń
        </p>
        <RadioGroup defaultValue="rzeszow">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RadioGroupItem id="main-rzeszow" value="rzeszow" />
            <Label htmlFor="main-rzeszow">Rzeszów — sala AIR SPACE</Label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RadioGroupItem id="main-debica" value="debica" />
            <Label htmlFor="main-debica">Dębica</Label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RadioGroupItem id="main-tyczyn" value="tyczyn" />
            <Label htmlFor="main-tyczyn">Tyczyn</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
