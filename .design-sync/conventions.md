## Air Squad UI — jak budować z tą biblioteką

**To jest panel administracyjny, nie strona marketingowa.** Ta biblioteka (`components/ui/`, shadcn/ui na Radix) obsługuje `/admin/*` (CRUD lokalizacji, trenerów, obozów, produktów, zamówień) i formularze (kontakt, logowanie) klubu sportowego Air Squad. Strony marketingowe klubu mają własne, ręcznie stylowane komponenty spoza tego zestawu — buduj tu w duchu narzędzia operacyjnego (gęstsze, funkcjonalne), nie kampanii reklamowej.

### 1. Wrapping i setup — brak jasnego motywu (najważniejsza pułapka)

Ta marka **nie ma jasnego wariantu**. `--background`/`--foreground`/`--muted-foreground` i pochodne zakładają ciemne tło strony (`oklch(0.13 0.02 275)` — głęboki granat, nie czysty czarny). Każdy ekran/kompozycja musi mieć nadrzędny kontener z `background: var(--background)` (lub `bg-background` jako klasa Tailwind) — bez tego jasny tekst renderuje się na białym/domyślnym tle i jest nieczytelny. Nie ma osobnego providera motywu do owinięcia — to zwykła zmienna CSS, nie kontekst reactowy.

Overlay/portal (Dialog, AlertDialog, Sheet, Popover, DropdownMenu, Tooltip) domyślnie renderują się zamknięte — do wymuszenia widocznego stanu użyj `defaultOpen` na komponencie root (przechodzi wprost do Radix).

### 2. Idiom stylowania — Tailwind v4 + tokeny CSS jako zmienne oklch

Brak systemu propsów stylistycznych — stylujesz przez klasy Tailwind, które mapują się na zmienne CSS w przestrzeni kolorów oklch. Prawdziwe nazwy tokenów (zweryfikowane w kodzie i na renderach):

| Klasa Tailwind | Rola |
|---|---|
| `bg-background` / `text-foreground` | strona / tekst główny |
| `bg-card` / `text-card-foreground` | powierzchnia karty (jaśniejsza od tła strony) |
| `bg-secondary` | tło sekcji (pośrednie między background a card) |
| `text-muted-foreground` | tekst przygaszony (etykiety, opisy) |
| `border-border` | domyślne obramowanie (białe @ 8% opacity) |
| `bg-primary` / `text-primary-foreground` | główny fiolet — akcje pierwszorzędne, focus ring |
| `bg-accent` / `text-accent-foreground` | niebieski — akcje drugorzędne |
| `text-cyan` `text-pink` `text-amber` `text-emerald` `text-violet-soft` | akcenty kategorii/statusów (nie mylić z `--destructive`, które jest osobnym czerwonym tokenem do akcji niszczących) |
| `bg-destructive` | czerwony, WYŁĄCZNIE do akcji nieodwracalnych (usuń, anuluj) |

Fonty: `font-sans` (Inter, tekst), `font-mono` (JetBrains Mono, etykiety/kod), `.display-bold` (Covered By Your Grace, odręczny — WYŁĄCZNIE duże nagłówki, nigdy UI/formularze administracyjne).

### 3. Gdzie leży prawda

`styles.css` w tym pakiecie to pełny skompilowany Tailwind ze strony (nie ręcznie pisany plik źródłowy) — zawiera każdą realnie użytą klasę i wartość tokenu. `<Name>.prompt.md` przy każdym komponencie ma jego properties z realnego `.d.ts`. Gdy klasa/token z tej tabeli nie wystarcza, przeszukaj `styles.css` zamiast zgadywać nową nazwę.

### 4. Przykładowy fragment (wzorzec z realnego panelu admina)

```tsx
<div style={{ background: 'var(--background)', padding: 24 }}>
  <Card>
    <CardHeader>
      <CardTitle>Edytuj trenera</CardTitle>
      <CardDescription>Dane widoczne na stronach grup treningowych.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      <Input placeholder="Imię i nazwisko" defaultValue="Patryk Dębski" />
      <Button className="w-full">Zapisz zmiany</Button>
    </CardContent>
  </Card>
</div>
```
