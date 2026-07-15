import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  Button,
} from 'airsquad-ui'

// Marka nie ma jasnego motywu — patrz .design-sync/conventions.md.
const canvas = { background: 'var(--background)', padding: 24 }

// Menu akcji dla wiersza trenera w panelu admina (/admin/trenerzy).
export function Default() {
  return (
    <div style={canvas}>
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Akcje
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Gabriel Myśliwiec</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              Edytuj dane trenera
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>Przypisz do grupy</DropdownMenuItem>
            <DropdownMenuItem>Duplikuj profil</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Usuń trenera</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Filtrowanie listy zamówień sklepu — checkboxy statusów zamówienia.
export function WithCheckboxItems() {
  return (
    <div style={canvas}>
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Status zamówienia
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Pokaż statusy</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Nowe</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Opłacone</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Wysłane</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem disabled>Anulowane</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Sortowanie listy grup treningowych — radio group.
export function WithRadioGroup() {
  return (
    <div style={canvas}>
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Sortuj: liczba zapisanych
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Sortuj grupy wg</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value="liczba">
            <DropdownMenuRadioItem value="nazwa">Nazwy grupy</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="liczba">Liczby zapisanych</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="wolne">Wolnych miejsc</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Przenoszenie zajęć do innej lokalizacji — podmenu (Sub).
export function WithSubmenu() {
  return (
    <div style={canvas}>
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            AcroKids — Rzeszów
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>Edytuj grupę</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Przenieś do lokalizacji</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Dębica</DropdownMenuItem>
              <DropdownMenuItem>Jasło</DropdownMenuItem>
              <DropdownMenuItem>Biecz</DropdownMenuItem>
              <DropdownMenuItem>Brzostek</DropdownMenuItem>
              <DropdownMenuItem>Pilzno</DropdownMenuItem>
              <DropdownMenuItem>Tyczyn</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Zamknij zapisy</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
