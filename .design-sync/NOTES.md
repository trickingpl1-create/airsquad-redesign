# Design-sync notes — airsquad-web

## Repo shape
- Nie jest to publikowany pakiet biblioteki — zwykła prywatna apka Next.js (`package.json`: `"private": true`, `"name": "my-project"`). Brak `main`/`module`/`exports`, brak Storybooka, brak `*.stories.*`.
- Zsynchronizowane komponenty to `components/ui/` (58 plików shadcn/ui) — **nie** komponenty stron (`components/home/`, `components/seo/` itd.), bo te są sprzężone z Next.js routingiem/Supabase i nie są przenośnymi prymitywami. Decyzja użytkownika z 2026-07-13.
- Tryb konwertera: **synth-entry** (brak `dist/`) — konwerter skanuje `components/ui/*.tsx` bezpośrednio ze źródła. Kontrakty `.d.ts` są przez to nieco słabsze niż z prawdziwego builda biblioteki, ale w pełni funkcjonalne.
- `--entry ./dist/index.js` (celowo nieistniejący plik) jest przekazywany przy KAŻDYM uruchomieniu `package-build.mjs` — to jedyny sposób, żeby konwerter poprawnie namierzył PKG_DIR (idąc w górę od `dirname(--entry)` aż znajdzie `package.json` z polem `name` — trafia na repo root). Bez `--entry` konwerter próbuje `node_modules/airsquad-ui/package.json`, które nie istnieje, i pada z ENOENT.
- **Nie użyłem `resync.mjs` (driver) w tym przebiegu** — cały czas wołałem `package-build.mjs`/`package-validate.mjs`/`package-capture.mjs` osobno, ręcznie śledząc stan. Działało w 100%, ale przyszły re-sync powinien spróbować `resync.mjs --remote .design-sync/.cache/remote-sync.json` (patrz przepis w SKILL.md) — nietestowane w tym repo, może wymagać dostrojenia.

## CSS i fonty — źródło i KRUCHOŚĆ (ważne dla re-syncu)
- `cssEntry` = `.next/static/chunks/1mrr_byk2hc7b.css` — pełny skompilowany Tailwind (production `next build`), zawiera realne wartości oklch/tokeny.
- `extraFonts` = `.next/static/chunks/0sbvh4r5yeyoa.css` — @font-face dla wszystkich 3 realnie używanych fontów (Inter, Covered By Your Grace, JetBrains Mono), z odsyłaczami do prawdziwych plików woff2 w `.next/static/media/`.
- **Nazwy tych dwóch plików `.css` są HASHOWANE przez Next.js i zmieniają się przy każdym `next build`.** Przed każdym re-syncem: uruchom `npm run build`, znajdź aktualne nazwy (`find .next/static/chunks -iname "*.css" -exec ls -la {} \;` — większy plik ~170KB to `cssEntry`, mniejszy ~8-9KB z `@font-face` to `extraFonts`), zaktualizuj `.design-sync/config.json`.

## Kolizja nazw — Toaster (naprawione konfiguracją, NIE kodem)
- `components/ui/toaster.tsx` (stary system oparty o Radix Toast + `hooks/use-toast.ts`) i `components/ui/sonner.tsx` (nowy, oparty o bibliotekę `sonner`) **oba eksportują komponent o nazwie `Toaster`**.
- Skutek: syntetyczny plik wejściowy robi `export * from "toaster.tsx"; export * from "sonner.tsx";` — ES moduły przy niejednoznacznym `export *` po prostu CICHO pomijają kolidującą nazwę z przestrzeni nazw modułu. Bundle buduje się bez błędu składni, ale `window.AirSquadUI.Toaster` nie istnieje → `[BUNDLE_EXPORT]` przy walidacji.
- **Zweryfikowane w kodzie**: `components/ui/toaster.tsx` nie jest importowany NIGDZIE w repo (0 wyników). Cały łańcuch `toaster.tsx` + `components/ui/toast.tsx` + `hooks/use-toast.ts` + `components/ui/use-toast.ts` to martwy kod — jedyny realnie używany Toaster to ten z `sonner.tsx` (`app/admin/(panel)/layout.tsx:5`).
- Fix: `componentSrcMap: {"Toaster": null}` w configu — wyklucza nazwę całkowicie.
- **Zalecenie dla użytkownika** (poza zakresem tego syncu): usunąć martwy kod (`toaster.tsx`, `toast.tsx`, `hooks/use-toast.ts`, `components/ui/use-toast.ts`) z repo — wtedy `Toaster` (sonner) wejdzie do design systemu bez wykluczenia.

## Ta marka nie ma jasnego motywu — najważniejsza pułapka przy autorowaniu podglądów
`--background`/`--foreground` itd. zakładają ciemne tło. Generator kart (`emit.mjs`, nie forkować) na sztywno ustawia `body{background:#fff}` w podglądzie — bez tego jasny tekst jest niewidoczny. **Każda autorowana historia musi zawijać swój JSX w `<div style={{background:'var(--background)', padding:24}}>`.** Odkryte i naprawione podczas pilotażu na Button/Card/Table (11-12.07), potem przekazane jako twarda konwencja wszystkim 7 agentom fan-outu — zero regresji w kolejnych 21 komponentach. Udokumentowane też w `.design-sync/conventions.md` (czyta to agent projektowy w Claude Design).

## cfg.overrides + preview-rebuild.mjs → [CONFIG_STALE] (ważne dla przyszłych zmian configu)
Dodanie `cfg.overrides.<Name>` (np. `cardMode`/`viewport` dla komponentów overlay: Dialog/AlertDialog/Sheet/Popover/Tooltip/DropdownMenu) **PO** ostatnim pełnym `package-build.mjs` unieważnia stempel builda dla tych komponentów — scoped `preview-rebuild.mjs --components X` odmawia działania (`[CONFIG_STALE]`), dopóki nie przejdzie pełny `package-build.mjs`. To zadziałało jako zamierzony bezpiecznik (złapało to 4 z 7 agentów fan-outu równolegle — poprawnie się zatrzymali i zgłosili zamiast obchodzić problem). **Wniosek na przyszłość: dodawaj WSZYSTKIE potrzebne `cfg.overrides` PRZED uruchomieniem fan-outu agentów, nie w trakcie** — jeśli jednak trzeba dodać w trakcie, jeden pełny rebuild naprawia to natychmiast dla wszystkich zablokowanych.
Wyjątek: `cardMode` dodany do naprawy `[GRID_OVERFLOW]` (Tabs, Textarea) NIE wywołał `[CONFIG_STALE]` — to prezentacyjna, nie strukturalna zmiana, `preview-rebuild.mjs` przyjął ją bez pełnego rebuilda (zgodnie z dokumentacją).

## Zakres podglądów (decyzja użytkownika 2026-07-13) — WYKONANE
24 rdzeniowe komponenty w pełni autorowane i ocenione „good": Button, Card, Table (moje solo), Badge, Sticker, Separator, Input, Textarea, Select, Checkbox, RadioGroup, Switch, Dialog, AlertDialog, Sheet, Tabs, Accordion, Empty, Avatar, Tooltip, Popover, DropdownMenu, Breadcrumb, Form (fan-out 7 agentów × 3, potem ja domknąłem 6 zablokowanych przez CONFIG_STALE).
Reszta (260 z 284) zostaje na podstawowej karcie (floor card) — można dopracować przy dowolnym kolejnym syncu bez powtarzania całości.

## Known render warns (42 — podstawowa karta renderuje się "pusto", oczekiwane, nie błąd)
Podczęści złożonych komponentów (mają sens tylko wewnątrz rodzica), świadomie NIE autoryzowane (poza zakresem 24 rdzeniowych):
AlertTitle, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbSeparator, ButtonGroupText, CardHeader, ContextMenuLabel, DrawerFooter, DrawerHeader, DropdownMenuLabel, FieldSeparator, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupTextarea, InputOTPSeparator, Item, KbdGroup, MenubarLabel, NavigationMenuItem, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, Progress, SheetFooter, SheetHeader, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, Spinner, TableCaption, TableCell, TableHead, Toggle.

## [TOKENS_MISSING] — nieszkodliwe, nie chodzone dalej
- `--font-inter`, `--font-jetbrains-mono`, `--font-covered-by-your-grace`: ustawiane w runtime przez `next/font` na `<html>`/`<body>` w `app/layout.tsx`, nie w statycznym CSS. Każde użycie w skompilowanym Tailwind CSS ma zaszyty fallback — realne pliki fontów są dostarczone przez `extraFonts`, więc wygląd i tak jest poprawny.
- `--radix-navigation-menu-viewport-height/width`: Radix ustawia je inline w JS w runtime — oczekiwane.
- `--color-brand-violet`: brak referencji w kodzie repo (sprawdzone grepem) — martwy/nieużywany artefakt w skompilowanym CSS. Nieszkodliwy.

## Separator „Pionowy" — subtelna usterka renderowania wysokości % we flex (zaobserwowana, nie naprawiona u źródła)
Podczas capture (Playwright/Chromium) pionowy `<Separator orientation="vertical">` z realną klasą `h-full` renderował się jako height:0px mimo poprawnego CSS (zweryfikowane: sam DOM wstawiony ręcznie poza drzewem React renderuje się poprawnie). Obejście w podglądzie: jawny `style={{height: 24}}` zamiast polegania na h-full — legalny, częsty wzorzec dla separatorów w wierszach flex. Nie wpływa na realną stronę (tam separatory renderują się w innym kontekście layoutu).

## Re-sync risks
- **CSS/fonty (patrz wyżej) są NAJWIĘKSZYM ryzykiem** — hashowane nazwy plików w `.next/static/chunks/` zmieniają się przy każdym buildzie; `.design-sync/config.json` trzeba ręcznie zaktualizować przed każdym re-syncem.
- `componentSrcMap: {"Toaster": null}` przestanie być potrzebne, jeśli użytkownik usunie martwy kod starego systemu toastów (patrz wyżej).
- `cfg.overrides` (viewport dla 6 komponentów overlay + cardMode dla Tabs/Textarea) muszą przetrwać w configu — usunięcie ich cofnie [GRID_OVERFLOW]/nieczytelne karty overlay.
- Reszta 260 nieautoryzowanych komponentów to trwały stan, nie "do naprawienia" — świadoma decyzja zakresu z 2026-07-13.
- `resync.mjs` (driver) nie był używany/testowany w tym repo — pierwszy prawdziwy re-sync powinien się nim posłużyć zgodnie z SKILL.md, ale sprawdzić czy diff/verdict działają poprawnie z tym niestandardowym (synth-entry, brak Storybooka) setupem.
