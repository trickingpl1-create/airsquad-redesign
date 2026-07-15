import type { Event } from '@/lib/types/database'

// Fallback treści strony /letni/ (Air Camp — obóz letni) na czas, gdy Supabase
// nie jest podłączony. Treść oparta na dawnej stronie airsquad.pl (sekcja Air Camp
// + obozy Diamond/Air Squad) i obecnych materiałach /aircamp. Po podłączeniu i
// zaseedowaniu bazy wiersz z DB ma priorytet. Patrz [[supabase-before-launch]].
export const LETNI_EVENT: Event = {
  id: 'fallback-letni',
  slug: 'letni',
  title: 'Air Camp — obóz letni',
  meta_title:
    'Air Camp — letni obóz sportowy dla dzieci i młodzieży | Air Squad',
  meta_description:
    'Letni obóz Air Squad: akrobatyka, longboard, kajaki, SUP, paintball i gry terenowe. Turnusy od czerwca do sierpnia, małe grupy, dwóch trenerów. Zarezerwuj turnus!',
  event_type: 'oboz',
  event_date: null,
  event_time: null,
  location: 'Podkarpacie',
  tagline: 'lato, którego nie zapomnisz.',
  image_url: '/images/letni/hero.jpg',
  description:
    '<p>Air Camp to letni obóz sportowo-rekreacyjny Air Squad — cały dzień pełen ruchu, przygody i nowych umiejętności. Łączymy treningi akrobatyki i trickingu na profesjonalnych matach AirTrack z atrakcjami na wodzie i w terenie. Małe grupy, dwóch trenerów na grupę i program ułożony tak, żeby każdy — od początkującego po zaawansowanego — wrócił z obozu z nową umiejętnością i wakacyjnymi wspomnieniami.</p>',
  stats: [
    { value: 'VI–VIII', label: 'turnusy w wakacje' },
    { value: '20', label: 'maks. osób w grupie' },
    { value: '2', label: 'trenerów na grupę' },
    { value: '8+', label: 'dyscyplin i atrakcji' },
  ],
  attractions: [
    { icon: '🤸', title: 'Akrobatyka', desc: 'Codzienne treningi na ścieżce AirTrack — od podstaw do salt.' },
    { icon: '🌀', title: 'Tricking', desc: 'Kopnięcia, obroty i kombinacje pod okiem trenerów.' },
    { icon: '🛹', title: 'Longboardy', desc: 'Nauka jazdy i pierwsze triki. Sprzęt zapewniamy.' },
    { icon: '🛶', title: 'Kajaki', desc: 'Spływy i zabawy na wodzie pod opieką instruktorów.' },
    { icon: '🏄', title: 'SUP', desc: 'Deski z wiosłem na jeziorze — równowaga i frajda.' },
    { icon: '🎯', title: 'Paintball', desc: 'Taktyczne gry zespołowe w leśnym terenie.' },
    { icon: '💃', title: 'Taniec / show', desc: 'Choreografie i pokaz na zakończenie turnusu.' },
    { icon: '🧭', title: 'Gry terenowe', desc: 'Podchody, survival i wieczorne ogniska.' },
  ],
  program: [
    { time: '08:00', title: 'Pobudka i śniadanie', description: 'Rozruch i energia na cały dzień.' },
    { time: '09:30', title: 'Trening akrobatyki', description: 'Sesja na matach AirTrack w grupach wg poziomu.' },
    { time: '12:00', title: 'Obiad i odpoczynek', description: 'Regeneracja przed popołudniowymi atrakcjami.' },
    { time: '14:00', title: 'Atrakcje wodne', description: 'Kajaki, SUP lub plażowanie — zależnie od dnia.' },
    { time: '17:00', title: 'Gry terenowe', description: 'Paintball, podchody, zabawy zespołowe.' },
    { time: '20:00', title: 'Wieczór integracyjny', description: 'Ognisko, pokazy, gry — codziennie inny motyw.' },
  ],
  includes:
    '<ul><li>Nocleg i pełne wyżywienie (4 posiłki dziennie)</li><li>Cały sprzęt sportowy — maty AirTrack, longboardy, kajaki, SUP, paintball</li><li>Opieka doświadczonych trenerów i wychowawców 24/7</li><li>Ubezpieczenie NNW i transport na atrakcje</li><li>Pamiątkowa koszulka Air Squad i dyplom na zakończenie</li></ul>',
  pricing: [],
  form_url: null,
  gallery: [
    { url: '/images/letni/galeria-kajaki.jpg', caption: '// kajaki i SUP na jeziorze' },
    { url: '/images/letni/galeria-paintball.jpg', caption: '// paintball w lesie' },
    { url: '/images/letni/galeria-akro.jpg', caption: '// akrobatyka na plaży' },
  ],
  is_active: true,
  is_published: true,
  created_at: '',
  updated_at: '',
}

// Fallback treści /airmeeting/ i /gravityjam/ — treść wzięta z już zatwierdzonych
// opisów na stronie głównej (components/home/promo-section.tsx), żeby nowy
// dropdown „Obozy i wydarzenia" w menu nie prowadził na puste strony 404.
// Po podłączeniu i zaseedowaniu bazy wiersz z DB ma priorytet.
export const AIRMEETING_EVENT: Event = {
  id: 'fallback-airmeeting',
  slug: 'airmeeting',
  title: 'Air Meeting 2026',
  meta_title: 'Air Meeting 2026 — zlot akrobatyczny | Air Squad',
  meta_description:
    'Air Meeting 2026 — spotkanie, zawody i wspólne emocje. Niezapomniane wydarzenie dla członków klubu Air Squad.',
  event_type: 'airmeeting',
  event_date: null,
  event_time: null,
  location: 'Podkarpacie',
  tagline: 'spotkanie, zawody, wspólne emocje.',
  image_url: null,
  description:
    '<p>Spotkanie, zawody i wspólne emocje. Niezapomniane, przepełnione pozytywną energią wydarzenie dla członków klubu Air Squad. Szczegóły najbliższej edycji wkrótce.</p>',
  program: [],
  pricing: [],
  includes: null,
  form_url: null,
  stats: [],
  attractions: [],
  gallery: [],
  is_active: true,
  is_published: true,
  created_at: '',
  updated_at: '',
}

export const GRAVITYJAM_EVENT: Event = {
  id: 'fallback-gravityjam',
  slug: 'gravityjam',
  title: 'Gravity Jam — święto kultury ulicznej',
  meta_title: 'Gravity Jam — jam akrobatyczny i święto kultury ulicznej | Air Squad',
  meta_description:
    'Gravity Jam — warsztaty rolkowe, akrobatyczne, strefa longboardowa i gier drewnianych. Air Squad razem z MB Park i Street Life Rzeszów.',
  event_type: 'gravityjam',
  event_date: null,
  event_time: null,
  location: 'Rzeszów',
  tagline: 'święto kultury ulicznej.',
  image_url: null,
  description:
    '<p>Warsztaty rolkowe, akrobatyczne, strefa longboardowa i gier drewnianych. Gravity Jam to wspólna inicjatywa Air Squad, MB Park i Street Life Rzeszów.</p>',
  program: [],
  pricing: [],
  includes: null,
  form_url: null,
  stats: [],
  attractions: [],
  gallery: [],
  is_active: true,
  is_published: true,
  created_at: '',
  updated_at: '',
}

export const FALLBACK_EVENTS: Record<string, Event> = {
  letni: LETNI_EVENT,
  airmeeting: AIRMEETING_EVENT,
  gravityjam: GRAVITYJAM_EVENT,
}
