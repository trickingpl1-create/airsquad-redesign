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
  meta_title:
    'Akrobatyka dla dzieci i dorosłych — Rzeszów i Podkarpacie | Air Squad',
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

// Mapa fallbacków dyscyplin po slug (na razie tylko akrobatyka ma pełną treść).
export const FALLBACK_DISCIPLINES: Record<string, Discipline> = {
  akrobatyka: AKROBATYKA_DISCIPLINE,
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
