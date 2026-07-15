import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from 'airsquad-ui'

// Marka nie ma jasnego motywu — --background/--foreground zakładają ciemne
// tło strony (patrz .design-sync/conventions.md). Każda historia ustawia
// realne tło strony.
const canvas = { background: 'var(--background)', padding: 24 }

export function Default() {
  return (
    <div style={canvas}>
      <Accordion type="single" collapsible defaultValue="item-1" style={{ width: 480, color: 'var(--foreground)' }}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Jak zapisać dziecko na zajęcia?</AccordionTrigger>
          <AccordionContent>
            Zapisy prowadzimy przez system AIPAX — wybierz miasto i grupę
            treningową (np. AcroKids, AcroJunior), a resztę formalności
            załatwisz online.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Ile kosztuje karnet miesięczny?</AccordionTrigger>
          <AccordionContent>
            Ceny zależą od grupy i liczby zajęć w tygodniu — pełny cennik
            znajdziesz w systemie AIPAX przy wyborze lokalizacji.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Czy jest okres próbny?</AccordionTrigger>
          <AccordionContent>
            Tak, pierwsze zajęcia próbne w AcroRzeszów i AcroKids są bezpłatne
            — skontaktuj się z trenerem prowadzącym grupę.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export function FaqSekcjiEvent() {
  return (
    <div style={canvas}>
      <Accordion type="multiple" defaultValue={['termin', 'lokalizacja']} style={{ width: 480, color: 'var(--foreground)' }}>
        <AccordionItem value="termin">
          <AccordionTrigger>Kiedy odbywa się Air Camp?</AccordionTrigger>
          <AccordionContent>
            Obóz letni Air Camp organizujemy w lipcu — dokładne terminy i
            turnusy publikujemy na stronie wydarzenia.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="lokalizacja">
          <AccordionTrigger>Gdzie odbywa się Gravity Jam?</AccordionTrigger>
          <AccordionContent>
            Gravity Jam to wydarzenie uliczne w Rzeszowie — rolki,
            akrobatyka i longboard na jednej scenie.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="zapisy">
          <AccordionTrigger>Jak zgłosić udział?</AccordionTrigger>
          <AccordionContent>
            Formularz zgłoszeniowy znajdziesz w zakładce wydarzenia — liczba
            miejsc jest ograniczona.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export function PojedynczyItemZDisabled() {
  return (
    <div style={canvas}>
      <Accordion type="single" collapsible defaultValue="czynne" style={{ width: 480, color: 'var(--foreground)' }}>
        <AccordionItem value="czynne">
          <AccordionTrigger>AcroTricking PRO — nabór otwarty</AccordionTrigger>
          <AccordionContent>
            Grupa dla zaawansowanych zawodników, trener: Łukasz Pacocha.
            Trening 3 razy w tygodniu w sali AIR SPACE.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="zamkniete" disabled>
          <AccordionTrigger>AcroKids 2 — brak wolnych miejsc</AccordionTrigger>
          <AccordionContent>Grupa zamknięta na ten sezon.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
