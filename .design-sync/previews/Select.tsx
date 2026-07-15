import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from 'airsquad-ui'
import { Label } from 'airsquad-ui'

// Marka nie ma jasnego motywu — --background/--foreground zakładają ciemne
// tło strony (patrz .design-sync/conventions.md). Każda historia ustawia
// realne tło strony, inaczej jasny tekst znika na białym płótnie podglądu.
// Select to portal Radix — domyślnie renderuje się zamknięty, więc każda
// historia wymusza `defaultOpen`, żeby SelectContent było widoczne.
const canvas = { background: 'var(--background)', padding: 24 }
const field = { display: 'flex', flexDirection: 'column' as const, gap: 6, width: 260 }

export function Default() {
  return (
    <div style={canvas}>
      <div style={field}>
        <Label htmlFor="select-default">Miasto</Label>
        <Select defaultValue="rzeszow">
          <SelectTrigger id="select-default" className="w-full">
            <SelectValue placeholder="Wybierz miasto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rzeszow">Rzeszów</SelectItem>
            <SelectItem value="debica">Dębica</SelectItem>
            <SelectItem value="jaslo">Jasło</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export function Open() {
  return (
    <div style={canvas}>
      <div style={field}>
        <Label htmlFor="select-open">Lokalizacja zajęć</Label>
        <Select defaultOpen defaultValue="rzeszow">
          <SelectTrigger id="select-open" className="w-full">
            <SelectValue placeholder="Wybierz miasto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rzeszow">Rzeszów</SelectItem>
            <SelectItem value="debica">Dębica</SelectItem>
            <SelectItem value="jaslo">Jasło</SelectItem>
            <SelectItem value="biecz">Biecz</SelectItem>
            <SelectItem value="brzostek">Brzostek</SelectItem>
            <SelectItem value="pilzno">Pilzno</SelectItem>
            <SelectItem value="tyczyn">Tyczyn</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export function Groups() {
  return (
    <div style={canvas}>
      <div style={field}>
        <Label htmlFor="select-groups">Grupa treningowa</Label>
        <Select defaultOpen defaultValue="acrotricking-pro">
          <SelectTrigger id="select-groups" className="w-full">
            <SelectValue placeholder="Wybierz grupę" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Akrobatyka</SelectLabel>
              <SelectItem value="acrorzeszow">AcroRzeszów</SelectItem>
              <SelectItem value="acrokids">AcroKids</SelectItem>
              <SelectItem value="acrokids-2">AcroKids 2</SelectItem>
              <SelectItem value="acrojunior">AcroJunior</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Tricking</SelectLabel>
              <SelectItem value="acrotricking">AcroTricking</SelectItem>
              <SelectItem value="acrotricking-pro">AcroTricking PRO</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export function Disabled() {
  return (
    <div style={canvas}>
      <div style={field}>
        <Label htmlFor="select-disabled">Trener prowadzący (przypisany automatycznie)</Label>
        <Select defaultValue="gabriel" disabled>
          <SelectTrigger id="select-disabled" className="w-full">
            <SelectValue placeholder="Wybierz trenera" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gabriel">Gabriel Myśliwiec</SelectItem>
            <SelectItem value="patryk">Patryk Dębski</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export function SmallAdminFilter() {
  return (
    <div style={canvas}>
      <div style={field}>
        <Label htmlFor="select-status">Status zamówienia</Label>
        <Select defaultOpen defaultValue="w-realizacji">
          <SelectTrigger id="select-status" size="sm" className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nowe">Nowe</SelectItem>
            <SelectItem value="w-realizacji">W realizacji</SelectItem>
            <SelectItem value="wyslane">Wysłane</SelectItem>
            <SelectItem value="anulowane">Anulowane</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
