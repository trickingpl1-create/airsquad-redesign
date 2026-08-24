import type { Discipline } from '@/lib/types/database'
import type { EnrolmentCity } from '@/components/akrobatyka/city-enrolment'

// Fallback treści strony /akrobatyka/ na czas, gdy Supabase nie jest jeszcze
// podłączony (placeholder). Treść 1:1 z scripts/005_seed_seo_pages.sql. Gdy
// baza zostanie podłączona i zaseedowana, wiersz z DB ma priorytet — ten
// fallback uruchamia się TYLKO gdy zapytanie nic nie zwróci. Patrz [[supabase-before-launch]].
export const AKROBATYKA_DISCIPLINE: Discipline = {
  id: 'fallback-akrobatyka',
  slug: 'akrobatyka',
  name: 'Akrobatyka',
  // Bez sufiksu "| Air Squad" — dokleja go szablon title z app/layout.tsx
  // (ta sama konwencja co w lib/content/cities.ts; wiersze w DB też jej wymagają)
  meta_title: 'Akrobatyka dla dzieci i dorosłych — Rzeszów i Podkarpacie',
  meta_description:
    'Zajęcia akrobatyki od 4 lat w 7 miastach na Podkarpaciu. Małe grupy, dwóch trenerów, ścieżki AirTrack. Pierwszy trening za 40 zł. Zapisz się!',
  h1_title: 'Akrobatyka',
  hero_tagline: 'od pierwszego przewrotu do salta.',
  hero_image_url: '/images/akrobatyka/hero-salto.jpg',
  hero_video_url: null,
  short_description:
    'Uczymy akrobatyki od podstaw — bezpiecznie, metodycznie i z frajdą. Małe grupy do 12 osób, dwóch trenerów na sali i profesjonalne ścieżki AirTrack, na których pierwsze salto przychodzi szybciej, niż myślisz.',
  full_description: null,
  age_requirement: 'od 4 lat',
  benefits: [],
  stats: [
    { value: '7', label: 'miast na Podkarpaciu' },
    { value: '4+', label: 'zaczynamy od 4. roku życia' },
    { value: '12', label: 'maks. osób w grupie' },
    { value: '2', label: 'trenerów na każdej sali' },
  ],
  levels: [
    {
      num: '01',
      title: 'Fundamenty',
      desc: 'Przewroty, mostki, stania na rękach, gibkość i siła. Nawyki, które chronią przed kontuzjami.',
      tag: 'POZIOM START',
    },
    {
      num: '02',
      title: 'Rundak i przerzuty',
      desc: 'Pierwsze elementy dynamiczne: rundak, przerzut bokiem i w przód — na ścieżce i z asekuracją.',
      tag: 'POZIOM 2',
    },
    {
      num: '03',
      title: 'Flik-flak',
      desc: 'Klucz do akrobatyki sportowej. Metodyka krok po kroku: z wałka, z pasów, na AirTracku, na parkiet.',
      tag: 'POZIOM 3',
    },
    {
      num: '04',
      title: 'Salta i łączenia',
      desc: 'Salto w przód, w tył, śruby i łączenia. Dla najlepszych — starty w pokazach i zawodach.',
      tag: 'POZIOM PRO',
    },
  ],
  session_flow: [
    {
      title: 'Rozgrzewka i gibkość (15 min)',
      desc: 'gry ruchowe u młodszych, mobilność u starszych.',
    },
    {
      title: 'Technika na ścieżce',
      desc: 'każdy ćwiczy element na swoim poziomie, trener asekuruje.',
    },
    {
      title: 'AirTrack i zeskoki',
      desc: 'bezpieczne powtórzenia, z których buduje się pewność.',
    },
    {
      title: 'Akrobatyka parterowa',
      desc: 'piramidy i elementy w parach, praca zespołowa.',
    },
    {
      title: 'Wyciszenie i rozciąganie',
      desc: 'szpagaty, mostki, podsumowanie postępów.',
    },
  ],
  age_groups: [
    {
      age: '4–6',
      name: 'AcroKids',
      desc: 'Zabawa ruchowa z elementami akrobatyki. Przewroty, równowaga, pierwsze mostki. 60 min.',
    },
    {
      age: '7–10',
      name: 'Acro I–II',
      desc: 'Systematyczna technika: rundak, przerzuty, przygotowanie do flika. 60–90 min.',
    },
    {
      age: '11–17',
      name: 'Acro Sport',
      desc: 'Flik-flak, salta, łączenia na ścieżce. Grupy wg poziomu, nie wieku. 90 min.',
    },
    {
      age: '18+',
      name: 'Dorośli',
      desc: 'Wieczorne grupy od zera i dla wracających po latach. W swoim tempie, bez presji.',
    },
  ],
  gallery: [
    {
      url: '/images/akrobatyka/galeria-dzieci.jpg',
      caption: '// trening grupy 7–10 lat',
    },
    {
      url: '/images/akrobatyka/galeria-szpagaty.jpg',
      caption: '// gibkość i szpagaty',
    },
    {
      url: '/images/akrobatyka/galeria-plaza.jpg',
      caption: '// akro nie kończy się na sali',
    },
  ],
  faq: [
    {
      question: 'Od ilu lat dziecko może zacząć?',
      answer:
        'Od 4. roku życia w grupach AcroKids. Górnej granicy nie ma — mamy też grupy dla dorosłych.',
    },
    {
      question: 'Czy akrobatyka jest bezpieczna?',
      answer:
        'Trenujemy na ścieżkach AirTrack i miękkich zeskokach, zawsze z dwoma trenerami i asekuracją. Nowe elementy wprowadzamy dopiero, gdy poprzednie są opanowane.',
    },
    {
      question: 'Czy pierwsze zajęcia są płatne?',
      answer:
        'Pierwszy trening próbny kosztuje 40 zł. Przyjdź, zobacz salę i sprawdź, czy to coś dla Was.',
    },
    {
      question: 'Moje dziecko już trenowało — do której grupy trafi?',
      answer:
        'Na zajęciach próbnych trener oceni poziom i dobierze grupę. Dzielimy wg umiejętności, nie tylko wieku.',
    },
    {
      question: 'Co jeśli w mojej miejscowości grupa jest pełna?',
      answer:
        'Zapisz się na listę rezerwową w formularzu — otwieramy nowe grupy, gdy zbierze się komplet.',
    },
  ],
  is_published: true,
  display_order: 1,
  created_at: '',
  updated_at: '',
}


// Pozostałe dyscypliny z chronionych URL-i (docs/03-mapa-url.md): /tricking-akademia/,
// /tumbling/, /longboardy/. Treść bazowa przeniesiona z scripts/005_seed_seo_pages.sql
// i uzupełniona faktami z podstron miast — seeda celowo NIE uruchamiamy, bo wiersz
// z bazy nadpisałby bogatsze fallbacki (patrz docs/04-architektura.md).
// Wieku nie bierzemy z seeda, tylko z realnych grafików grup w lib/content/cities.ts.
export const TRICKING_DISCIPLINE: Discipline = {
  id: 'fallback-tricking',
  slug: 'tricking-akademia',
  name: 'Tricking',
  meta_title: 'Tricking — akrobatyka, sztuki walki i breakdance',
  meta_description:
    'Tricking w Air Squad: salta, kopnięcia i kombinacje na matach AirTrack. Grupy naborowe od 9 lat oraz grupa zaawansowana. Rzeszów i Podkarpacie.',
  h1_title: 'Tricking Akademia',
  hero_tagline: 'akrobatyka, która wygląda jak film.',
  hero_image_url: '/images/dyscypliny/tricking.jpg',
  hero_video_url: null,
  short_description:
    'Połączenie akrobatyki z elementami sztuk walki i breakdance’u — widowiskowa forma ruchu dla młodzieży i dorosłych. Uczymy od pierwszego kopnięcia po pełne kombinacje.',
  full_description: null,
  age_requirement: 'od 9 lat',
  benefits: [],
  stats: [
    { value: '9+', label: 'wiek startowy w naborze' },
    { value: '2', label: 'grupy: nabór i zaawansowana' },
    { value: '2', label: 'trenerów na każdej sali' },
  ],
  levels: [
    { num: '01', title: 'Baza akrobatyczna', desc: 'Przewroty, rundak, przerzuty i bezpieczne lądowania. Bez tego nie ma trików.', tag: 'POZIOM START' },
    { num: '02', title: 'Kopnięcia i obroty', desc: 'Elementy ze sztuk walki: kopnięcia z obrotu, praca bioder i osi ciała.', tag: 'POZIOM 2' },
    { num: '03', title: 'Pierwsze triki', desc: 'Połączenie akrobatyki z kopnięciem — moment, w którym tricking zaczyna wyglądać jak tricking.', tag: 'POZIOM 3' },
    { num: '04', title: 'Kombinacje', desc: 'Łączenie trików w sekwencje, własny styl, nagrania i pokazy.', tag: 'POZIOM PRO' },
  ],
  session_flow: [],
  age_groups: [],
  gallery: [],
  faq: [],
  is_published: true,
  display_order: 2,
  created_at: '',
  updated_at: '',
}

export const TUMBLING_DISCIPLINE: Discipline = {
  id: 'fallback-tumbling',
  slug: 'tumbling',
  name: 'Tumbling',
  meta_title: 'Tumbling — skoki na ścieżce akrobatycznej',
  meta_description:
    'Tumbling w Air Squad — nauka przewrotów, przerzutów i salt na profesjonalnej ścieżce akrobatycznej. Zajęcia dla dzieci i młodzieży na Podkarpaciu.',
  h1_title: 'Tumbling',
  hero_tagline: 'seria skoków na jednym oddechu.',
  hero_image_url: '/images/old-site/tumbling.jpg',
  hero_video_url: null,
  short_description:
    'Skoki na ścieżce akrobatycznej: nauka przewrotów, przerzutów i salt — od podstaw po zaawansowane akrobacje. Miękka nawierzchnia AirTrack pozwala powtarzać element bez obciążania stawów.',
  full_description: null,
  age_requirement: 'od 7 lat',
  benefits: [],
  stats: [
    { value: '12', label: 'maks. osób w grupie' },
    { value: '2', label: 'trenerów na każdej sali' },
    { value: '7', label: 'miast na Podkarpaciu' },
  ],
  levels: [
    { num: '01', title: 'Przewroty i mostki', desc: 'Kontrola ciała i bezpieczne lądowanie — fundament każdego skoku.', tag: 'POZIOM START' },
    { num: '02', title: 'Rundak i przerzuty', desc: 'Pierwsze elementy dynamiczne na ścieżce, zawsze z asekuracją trenera.', tag: 'POZIOM 2' },
    { num: '03', title: 'Flik-flak', desc: 'Metodyka krok po kroku: z wałka, z pasów, na AirTracku, na parkiet.', tag: 'POZIOM 3' },
    { num: '04', title: 'Salta i śruby', desc: 'Łączenie elementów w serie — to, po co przychodzi się na tumbling.', tag: 'POZIOM PRO' },
  ],
  session_flow: [],
  age_groups: [],
  gallery: [],
  faq: [],
  is_published: true,
  display_order: 3,
  created_at: '',
  updated_at: '',
}

export const LONGBOARD_DISCIPLINE: Discipline = {
  id: 'fallback-longboardy',
  slug: 'longboardy',
  name: 'Longboard',
  meta_title: 'Longboardy — nauka jazdy i pierwsze triki',
  meta_description:
    'Longboard z Air Squad — nauka jazdy od podstaw, hamowanie, skręty i pierwsze triki. Deski do wypożyczenia na miejscu. Zajęcia i wyjazdy longboardowe.',
  h1_title: 'Longboardy',
  hero_tagline: 'asfalt zamiast maty.',
  hero_image_url: '/images/old-site/longboard.jpg',
  hero_video_url: null,
  short_description:
    'Nauka jazdy na longboardzie od podstaw do pierwszych trików. Sprzęt mamy na miejscu — na start wystarczysz Ty, reszta jest do wypożyczenia.',
  full_description: null,
  age_requirement: 'od 8 lat',
  benefits: [],
  stats: [
    { value: '0', label: 'własnego sprzętu na start' },
    { value: '2', label: 'trenerów na grupie' },
  ],
  levels: [
    { num: '01', title: 'Pierwsza jazda', desc: 'Postawa, odpychanie, utrzymanie kierunku. I najważniejsze — jak bezpiecznie zejść z deski.', tag: 'POZIOM START' },
    { num: '02', title: 'Hamowanie i skręty', desc: 'Footbrake, slajd i płynne skręcanie — bez tego nie ma jazdy poza płaskim.', tag: 'POZIOM 2' },
    { num: '03', title: 'Pierwsze triki', desc: 'Manuale, obroty i praca z deską w ruchu.', tag: 'POZIOM 3' },
  ],
  session_flow: [],
  age_groups: [],
  gallery: [],
  faq: [],
  is_published: true,
  display_order: 4,
  created_at: '',
  updated_at: '',
}

// Mapa fallbacków dyscyplin po slug. Komplet slugów z sekcji „Zachowane URL-e"
// docs/03-mapa-url.md — bez nich generateStaticParams ich nie widzi, a w eksporcie
// statycznym brakująca strona to twarde 404 aż do przebudowy.
export const FALLBACK_DISCIPLINES: Record<string, Discipline> = {
  akrobatyka: AKROBATYKA_DISCIPLINE,
  'tricking-akademia': TRICKING_DISCIPLINE,
  tumbling: TUMBLING_DISCIPLINE,
  longboardy: LONGBOARD_DISCIPLINE,
}

// 7 miast do sekcji zapisów. aipax_form_id = placeholder (wspólny formularz);
// po podłączeniu AIPAX podmienić na realne per-miasto. Patrz [[supabase-before-launch]].
const PLACEHOLDER_FORM_ID = '5f7b99af-6154-4e74-92f7-2be9066a38f6'
export const FALLBACK_ENROLMENT_CITIES: EnrolmentCity[] = [
  { slug: 'biecz', name: 'Biecz', aipaxFormId: PLACEHOLDER_FORM_ID },
  { slug: 'brzostek', name: 'Brzostek', aipaxFormId: PLACEHOLDER_FORM_ID },
  { slug: 'debica', name: 'Dębica', aipaxFormId: PLACEHOLDER_FORM_ID },
  { slug: 'jaslo', name: 'Jasło', aipaxFormId: PLACEHOLDER_FORM_ID },
  { slug: 'pilzno', name: 'Pilzno', aipaxFormId: PLACEHOLDER_FORM_ID },
  { slug: 'rzeszow', name: 'Rzeszów', aipaxFormId: PLACEHOLDER_FORM_ID },
  { slug: 'tyczyn', name: 'Tyczyn', aipaxFormId: PLACEHOLDER_FORM_ID },
]
