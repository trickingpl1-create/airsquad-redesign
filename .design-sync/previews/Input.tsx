import { Input } from 'airsquad-ui'
import { Label } from 'airsquad-ui'

// Marka nie ma jasnego motywu — --background/--foreground zakładają ciemne
// tło strony (patrz .design-sync/conventions.md). Każda historia ustawia
// realne tło strony, inaczej jasny tekst znika na białym płótnie podglądu.
const canvas = { background: 'var(--background)', padding: 24 }
const field = { display: 'flex', flexDirection: 'column' as const, gap: 6, width: 280 }

export function Default() {
  return (
    <div style={canvas}>
      <div style={field}>
        <Label htmlFor="input-default-imie">Imię i nazwisko dziecka</Label>
        <Input id="input-default-imie" placeholder="np. Zuzanna Kowalska" defaultValue="Zuzanna Kowalska" />
      </div>
    </div>
  )
}

export function Types() {
  return (
    <div style={{ ...canvas, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={field}>
        <Label htmlFor="input-email">E-mail rodzica</Label>
        <Input id="input-email" type="email" placeholder="rodzic@przyklad.pl" />
      </div>
      <div style={field}>
        <Label htmlFor="input-tel">Telefon kontaktowy</Label>
        <Input id="input-tel" type="tel" placeholder="+48 600 000 000" />
      </div>
      <div style={field}>
        <Label htmlFor="input-cena">Cena karnetu (zł)</Label>
        <Input id="input-cena" type="number" placeholder="150" />
      </div>
      <div style={field}>
        <Label htmlFor="input-haslo">Hasło do panelu admina</Label>
        <Input id="input-haslo" type="password" defaultValue="••••••••" />
      </div>
    </div>
  )
}

export function States() {
  return (
    <div style={{ ...canvas, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={field}>
        <Label htmlFor="input-focus">Nazwa grupy treningowej</Label>
        <Input id="input-focus" defaultValue="AcroTricking PRO" autoFocus />
      </div>
      <div style={field}>
        <Label htmlFor="input-disabled">Miasto (ustalone przez trenera)</Label>
        <Input id="input-disabled" defaultValue="Rzeszów" disabled />
      </div>
      <div style={field}>
        <Label htmlFor="input-invalid">Adres e-mail do faktury</Label>
        <Input id="input-invalid" defaultValue="biuro@airsquad" aria-invalid="true" />
        <span style={{ fontSize: 12, color: 'var(--destructive)' }}>Podaj poprawny adres e-mail.</span>
      </div>
    </div>
  )
}

export function AdminSearch() {
  return (
    <div style={canvas}>
      <div style={field}>
        <Label htmlFor="input-search">Szukaj zamówienia</Label>
        <Input id="input-search" placeholder="Numer zamówienia lub nazwisko" />
      </div>
    </div>
  )
}
