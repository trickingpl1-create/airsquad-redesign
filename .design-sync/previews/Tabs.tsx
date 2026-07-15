import { Tabs, TabsList, TabsTrigger, TabsContent } from 'airsquad-ui'

// Marka nie ma jasnego motywu — --background/--foreground zakładają ciemne
// tło strony (patrz .design-sync/conventions.md). Każda historia ustawia
// realne tło strony.
const canvas = { background: 'var(--background)', padding: 24 }

export function Default() {
  return (
    <div style={canvas}>
      <Tabs defaultValue="rzeszow" style={{ width: 420 }}>
        <TabsList>
          <TabsTrigger value="rzeszow">Rzeszów</TabsTrigger>
          <TabsTrigger value="debica">Dębica</TabsTrigger>
          <TabsTrigger value="jaslo">Jasło</TabsTrigger>
        </TabsList>
        <TabsContent value="rzeszow" style={{ color: 'var(--foreground)', fontSize: 14 }}>
          Sala AIR SPACE, ul. Boya-Żeleńskiego 15. Grupy: AcroKids, AcroJunior,
          AcroTricking, AcroTricking PRO.
        </TabsContent>
        <TabsContent value="debica" style={{ color: 'var(--foreground)', fontSize: 14 }}>
          Zajęcia AcroKids i AcroJunior — grafik i zapisy przez system AIPAX.
        </TabsContent>
        <TabsContent value="jaslo" style={{ color: 'var(--foreground)', fontSize: 14 }}>
          Grupa AcroRzeszów wyjazdowa raz w tygodniu — sprawdź aktualny grafik.
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function PanelAdmina() {
  return (
    <div style={canvas}>
      <Tabs defaultValue="dane" style={{ width: 480 }}>
        <TabsList>
          <TabsTrigger value="dane">Dane zamówienia</TabsTrigger>
          <TabsTrigger value="platnosc">Płatność</TabsTrigger>
          <TabsTrigger value="wysylka">Wysyłka</TabsTrigger>
        </TabsList>
        <TabsContent value="dane" style={{ color: 'var(--foreground)', fontSize: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div>Klient: Anna Kowalska</div>
          <div>Produkt: Bluza z kapturem Air Squad, rozmiar M</div>
        </TabsContent>
        <TabsContent value="platnosc" style={{ color: 'var(--foreground)', fontSize: 14 }}>
          Status: opłacone — przelew tradycyjny, 129 zł
        </TabsContent>
        <TabsContent value="wysylka" style={{ color: 'var(--foreground)', fontSize: 14 }}>
          Odbiór osobisty w sali AIR SPACE, Rzeszów
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function StanZDisabled() {
  return (
    <div style={canvas}>
      <Tabs defaultValue="aktywni" style={{ width: 420 }}>
        <TabsList>
          <TabsTrigger value="aktywni">Zawodnicy aktywni</TabsTrigger>
          <TabsTrigger value="archiwum" disabled>
            Archiwum
          </TabsTrigger>
        </TabsList>
        <TabsContent value="aktywni" style={{ color: 'var(--foreground)', fontSize: 14 }}>
          Grupa AcroTricking PRO — 12 zawodników, trener: Patryk Dębski
        </TabsContent>
      </Tabs>
    </div>
  )
}
