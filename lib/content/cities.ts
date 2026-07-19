import type { CityPage } from '@/lib/types/database'

// Fallbacki landingów miast — treść przeniesiona 1:1 z oryginalnych podstron
// airsquad.pl (WordPress). Wiersz z bazy (city_pages) ma pierwszeństwo nad
// fallbackiem (data ?? FALLBACK — jak dyscypliny/eventy), więc po podłączeniu
// realnego Supabase te dane trzeba przenieść do seeda, inaczej chude wiersze
// z 005_seed_seo_pages.sql nadpiszą bogatą treść.
//
// Grafiki grup: stan z airsquad.pl (sezon 2025/26) — do samodzielnej edycji
// przez klub; UI dopisuje „grafik może ulec zmianie — potwierdź w AIPAX".
//
// Filmy „Nasze Zajawki": oryginalne MP4 hostowane na WordPressie (12–63 MB,
// za duże do repo) — linkujemy bezpośrednio; przenieść do Supabase Storage
// przed wygaszeniem starego WordPressa.

/** Wspólne dane kontaktowe klubu (NAP) — widok + schema.org */
export const CLUB_CONTACT = {
  phone: '728 559 101',
  phoneTrainer: '722 248 546', // trener Gabriel
  phoneSchema: '+48728559101',
  email: 'klub.airsquad@gmail.com',
} as const

/** Zasady płatności — treść oryginalna z airsquad.pl */
export const PAYMENT_INFO = {
  deadline: 'Płatność za zajęcia do 10. dnia każdego miesiąca.',
  lateFee: 'Po terminie doliczane jest 30 zł.',
  account:
    'Przelew na konto Stowarzyszenia Air Squad — dane w potwierdzeniu zapisu AIPAX.',
} as const

const AIPAX_FORM_ID = '5f7b99af-6154-4e74-92f7-2be9066a38f6'
const WP_UPLOADS = 'https://airsquad.pl/wp-content/uploads'

export const FALLBACK_CITY_PAGES: Record<string, CityPage> = {
  rzeszow: {
    id: 'fallback-rzeszow',
    location_id: '',
    slug: 'rzeszow',
    // Bez sufiksu "| Air Squad" — dokleja go szablon title z app/layout.tsx
    meta_title: 'Akrobatyka Rzeszów — zajęcia dla dzieci i dorosłych',
    meta_description:
      'Zajęcia akrobatyki w Rzeszowie dla dzieci od 4 lat, młodzieży i dorosłych. Małe grupy, doświadczeni trenerzy, profesjonalne maty AirTrack. Zapisz się na zajęcia próbne.',
    h1_title: 'Akrobatyka Rzeszów',
    hero_tagline: null,
    hero_content:
      '<p>Akrobatyka, tricking i tumbling dla dzieci, młodzieży i dorosłych. Każde zajęcia prowadzi <strong>dwóch wykwalifikowanych trenerów</strong> na super-miękkich matach AirTrack.</p>',
    main_content:
      '<p><strong>Tricking</strong> to połączenie akrobatyki z elementami sztuk walki (np. kopnięcia) oraz elementami breakdance&rsquo;u — widowiskowa forma ruchu dla młodzieży i dorosłych.</p><p><strong>Tumbling</strong>, czyli skoki na ścieżce, to nauka przewrotów, przerzutów i salt — od podstaw po zaawansowane akrobacje.</p>',
    schedule_content: null,
    groups_info: [
      { name: 'AcroRzeszów', days: 'pn · śr', hours: '16:30–17:30', age: 'od 7 lat', level: 'grupa naborowa', enrolling: true },
      { name: 'AcroTricking', days: 'wt · czw', hours: '16:30–17:30', age: 'od 8 lat', level: 'akrobatyka + tricking', enrolling: true },
      { name: 'AcroKids', days: 'pn · śr', hours: '17:30–18:30', level: 'grupa dziecięca' },
      { name: 'AcroKids 2', days: 'wt · czw', hours: '17:30–18:30', level: 'grupa dziecięca' },
      { name: 'AcroJunior', days: 'wt · czw', hours: '18:30–19:30', level: 'młodzież' },
      { name: 'AcroTricking PRO', days: 'pn · śr', hours: '18:30–20:00', level: 'grupa zaawansowana' },
    ],
    faq: [
      {
        question: 'Od ilu lat dziecko może zacząć akrobatykę w Rzeszowie?',
        answer:
          'Najmłodsze grupy (AcroKids) przyjmują dzieci od 4 lat. Grupy naborowe AcroRzeszów startują od 7 lat, a AcroTricking od 8 lat.',
      },
      {
        question: 'Gdzie odbywają się treningi w Rzeszowie?',
        answer:
          'W sali AIR SPACE przy ul. Boya-Żeleńskiego 15 w Rzeszowie — profesjonalne maty AirTrack i pełne zaplecze akrobatyczne.',
      },
      {
        question: 'Jak zapisać dziecko na zajęcia?',
        answer:
          'Zapisy prowadzimy online przez system AIPAX — wybierz grupę w kalendarzu i wypełnij formularz. O ostatecznym przydziale do grupy decyduje trener (tel. 722 248 546).',
      },
      {
        question: 'Ile kosztują zajęcia i jak płacić?',
        answer:
          'Płatność za zajęcia do 10. dnia każdego miesiąca (po terminie doliczane jest 30 zł). Szczegóły płatności otrzymasz w potwierdzeniu zapisu AIPAX.',
      },
      {
        question: 'W czym dziecko ma ćwiczyć?',
        answer:
          'Wystarczy wygodny strój sportowy i woda. Ćwiczymy boso lub w skarpetkach — na super-miękkich matach AirTrack.',
      },
    ],
    aipax_form_id: '860001af-05fb-440b-a699-404b78200c86',
    is_published: true,
    created_at: '',
    updated_at: '',
    city_name: 'Rzeszów',
    city_locative: 'w Rzeszowie',
    hero_image_url: '/images/miasta/rzeszow-hero.jpg',
    hero_image_position: 'right 78%',
    training_days_label: 'od poniedziałku do piątku',
    hall: {
      name: 'Sala AIR SPACE Rzeszów',
      address: 'ul. Boya-Żeleńskiego 15',
      city: 'Rzeszów',
      mapQuery: 'Air Space, Boya-Żeleńskiego 15, Rzeszów',
      image_url: '/images/miasta/rzeszow-sala.jpg',
      hideMap: true,
    },
    trainers: [
      { name: 'Gabriel Myśliwiec', role: 'instruktor akrobatyki, trener trickingu' },
      { name: 'Łukasz Pacocha', role: 'instruktor akrobatyki' },
    ],
    trainers_image_url: '/images/miasta/rzeszow-trenerzy.jpg',
    first_training: [
      { title: 'Wygodny strój i woda', desc: 'Nic więcej nie potrzebujesz na start.' },
      { title: 'Rozgrzewka z grupą', desc: 'Pod okiem dwóch trenerów.' },
      { title: 'Bezpieczne upadki', desc: 'Podstawy asekuracji na matach AirTrack.' },
      { title: 'Pierwsze elementy', desc: 'Ćwiczenia dobrane do poziomu dziecka.' },
    ],
    benefits: ['prawidłowa postawa', 'motoryka i koordynacja', 'równowaga', 'koncentracja', 'pewność siebie'],
    gallery: [
      { url: '/images/miasta/rzeszow-galeria-1.jpg', caption: 'Trening akrobatyki w Air Space' },
      { url: '/images/miasta/rzeszow-galeria-2.jpg', caption: 'Salto na ścieżce' },
      { url: '/images/miasta/rzeszow-galeria-3.jpg', caption: 'Zajęcia grupowe' },
      { url: '/images/miasta/rzeszow-galeria-4.jpg', caption: 'Skoki na AirTracku' },
    ],
    videos: [
      {
        url: `${WP_UPLOADS}/2023/09/VID_24881213_090738_541.mp4`,
        poster: '/images/miasta/rzeszow-zajawka.jpg',
        label: 'Skoki na ścieżce / Tumbling',
      },
      {
        url: `${WP_UPLOADS}/2023/09/InShot_20230829_174952099.mp4`,
        label: 'Trening w Air Space',
      },
    ],
  },

  debica: {
    id: 'fallback-debica',
    location_id: '',
    slug: 'debica',
    meta_title: 'Akrobatyka Dębica — zajęcia dla dzieci i dorosłych',
    meta_description:
      'Zajęcia akrobatyki w Dębicy dla dzieci od 4 lat, młodzieży i dorosłych. Małe grupy i doświadczeni trenerzy. Zapisz się na zajęcia próbne.',
    h1_title: 'Akrobatyka Dębica',
    hero_tagline: null,
    hero_content:
      '<p>Prowadzimy zapisy do nowych grup na nowo powstałej sali akrobatycznej <strong>AIR SPACE Dębica</strong>. Małe grupy (max 20 osób), sprzęt AirTrack i doświadczeni trenerzy.</p>',
    main_content:
      '<p>Treningi akrobatyki dla dzieci od 7. roku życia prowadzimy w salach Szkoły Podstawowej nr 4 i nr 10 w Dębicy. Zajęcia rozwijają koordynację, siłę i pewność ruchu — od pierwszych przewrotów po salta na matach AirTrack.</p>',
    schedule_content: null,
    groups_info: [
      { name: 'Acro Dębica NABÓR (SP nr 4)', days: 'pn', hours: '16:30–17:30', age: 'od 7 lat', enrolling: true },
      { name: 'Acro Dębica NABÓR (SP nr 10)', days: 'pt', hours: '16:30–17:30', age: 'od 7 lat', enrolling: true },
      { name: 'Acro Dębica 1', days: 'śr', hours: '16:30–17:30', level: 'grupa podstawowa' },
      { name: 'Acro Dębica 2', days: 'pn (SP4) · pt (SP10)', hours: '17:30–18:30', level: 'kontynuacja' },
      { name: 'Acro Dębica 3', days: 'śr (SP4) · pt (SP10)', hours: '17:30–19:30', level: 'grupa zaawansowana' },
    ],
    faq: [
      {
        question: 'Od ilu lat dziecko może zacząć akrobatykę w Dębicy?',
        answer: 'Grupy naborowe w Dębicy przyjmują dzieci od 7. roku życia. Grupy są małe — maksymalnie 20 osób.',
      },
      {
        question: 'Gdzie odbywają się treningi w Dębicy?',
        answer: 'W salach Szkoły Podstawowej nr 4 i Szkoły Podstawowej nr 10 w Dębicy (AIR SPACE Dębica) — na profesjonalnym sprzęcie AirTrack.',
      },
      {
        question: 'Jak zapisać dziecko na zajęcia w Dębicy?',
        answer: 'Nabór oraz kontynuacja — przez formularz online AIPAX. O przydziale do grupy decyduje trener (tel. 722 248 546).',
      },
      {
        question: 'Jak wyglądają płatności?',
        answer: 'Płatność do 10. dnia miesiąca z góry (po terminie doliczane jest 30 zł), przelewem na konto Stowarzyszenia Air Squad.',
      },
    ],
    aipax_form_id: AIPAX_FORM_ID,
    is_published: true,
    created_at: '',
    updated_at: '',
    city_name: 'Dębica',
    city_locative: 'w Dębicy',
    hero_image_url: '/images/miasta/debica-hero.jpg',
    hero_image_position: 'right 46%',
    hall: {
      name: 'AIR SPACE Dębica',
      address: 'SP nr 4 i SP nr 10',
      city: 'Dębica',
      mapQuery: 'Szkoła Podstawowa nr 4, Dębica',
      note: 'Zajęcia odbywają się w salach Szkoły Podstawowej nr 4 i nr 10 w Dębicy.',
      routes: [
        { label: 'SP nr 4', mapQuery: 'Szkoła Podstawowa nr 4, Dębica' },
        { label: 'SP nr 10', mapQuery: 'Szkoła Podstawowa nr 10, Dębica' },
        { label: 'AirSpace Dębica', mapQuery: 'AirSpace Dębica, Lwowska 51, Dębica', color: 'primary' },
      ],
      hideMap: true,
    },
    trainers: [
      { name: 'Patryk Dębski', role: 'licencjat fizjoterapii' },
      { name: 'Gabriela Cichoń', role: 'magister fizjoterapii' },
      { name: 'Gabriel Myśliwiec', role: 'instruktor akrobatyki, trener trickingu' },
    ],
    trainers_image_url: '/images/miasta/debica-trenerzy.jpg',
    first_training: [
      { title: 'Wygodny strój i woda', desc: 'To wszystko, czego potrzebuje dziecko na start.' },
      { title: 'Poznanie grupy', desc: 'Rozgrzewka i pierwsze ćwiczenia z trenerami.' },
      { title: 'Bezpieczne podstawy', desc: 'Nauka asekuracji i upadków na AirTracku.' },
      { title: 'Dobór grupy', desc: 'Trener oceni poziom i zaproponuje właściwą grupę.' },
    ],
    benefits: ['prawidłowa postawa', 'koordynacja', 'siła i gibkość', 'praca w grupie', 'dyscyplina'],
    videos: [
      {
        url: 'https://www.youtube.com/embed/w4_uA0wOyak',
        poster: '/images/miasta/debica-zajawka.jpg',
        label: 'Trening w AIR SPACE Dębica',
      },
    ],
  },

  jaslo: {
    id: 'fallback-jaslo',
    location_id: '',
    slug: 'jaslo',
    meta_title: 'Akrobatyka Jasło — zajęcia dla dzieci i dorosłych',
    meta_description:
      'Zajęcia akrobatyki w Jaśle dla dzieci od 4 lat, młodzieży i dorosłych. Małe grupy i doświadczeni trenerzy. Zapisz się na zajęcia próbne.',
    h1_title: 'Akrobatyka Jasło',
    hero_tagline: null,
    hero_content:
      '<p>Treningi akrobatyki w Jaśle — grupy maksymalnie 20-osobowe, wykwalifikowani trenerzy i profesjonalny sprzęt <strong>AirTrack</strong>. Zajęcia wzbogacone o elementy trickingu.</p>',
    main_content:
      '<p>Regularne treningi akrobatyki poprawiają sylwetkę i pomagają eliminować wady postawy. Dzieci rozwijają zdolności motoryczne, równowagę i orientację w przestrzeni, a praca w grupie uczy koncentracji, zaangażowania i dyscypliny.</p>',
    schedule_content: null,
    groups_info: [
      { name: 'Acro Jasło NABÓR', days: 'pn', hours: '15:45–16:45', age: 'od 6 lat', level: 'grupa początkująca', enrolling: true },
      { name: 'Acro Jasło NABÓR 2', days: 'pt', hours: '16:45–17:45', age: 'od 6 lat', level: 'grupa początkująca', enrolling: true },
      { name: 'Acro Jasło 1', days: 'śr', hours: '16:45–17:45', level: 'grupa podstawowa' },
      { name: 'Acro Jasło 2', days: 'śr · pt', hours: '15:45–17:00', level: 'średnio-zaawansowana' },
      { name: 'Acro Jasło 3', days: 'pn · śr · pt', hours: '16:00–17:00', level: 'grupa zaawansowana' },
    ],
    faq: [
      {
        question: 'Od ilu lat dziecko może trenować w Jaśle?',
        answer: 'Grupy naborowe w Jaśle przyjmują dzieci od 6. roku życia. Poziom grupy dobiera trener po pierwszych zajęciach.',
      },
      {
        question: 'Gdzie odbywają się zajęcia w Jaśle?',
        answer: 'W Podkarpackim Centrum Sportów Walki w Jaśle — na profesjonalnych matach AirTrack.',
      },
      {
        question: 'Jak zapisać dziecko?',
        answer: 'Zapisy prowadzimy online przez system AIPAX — zarówno nabór, jak i kontynuację. Pytania: tel. 722 248 546 (trener Gabriel).',
      },
      {
        question: 'Ile kosztują zajęcia i jak płacić?',
        answer: 'Płatność do 10. dnia każdego miesiąca (po terminie +30 zł), przelewem na konto Stowarzyszenia Air Squad.',
      },
    ],
    aipax_form_id: AIPAX_FORM_ID,
    is_published: true,
    created_at: '',
    updated_at: '',
    city_name: 'Jasło',
    city_locative: 'w Jaśle',
    hero_image_url: '/images/miasta/jaslo-hero.jpg',
    hall: {
      name: 'Podkarpackie Centrum Sportów Walki',
      address: 'Podkarpackie Centrum Sportów Walki',
      city: 'Jasło',
      mapQuery: 'Podkarpackie Centrum Sportów Walki Jasło',
    },
    trainers: [
      { name: 'Gabriel Myśliwiec', role: 'akrobatyka, tricking' },
      { name: 'Agnieszka Sobczyk', role: 'samoobrona, judo, trening personalny' },
      { name: 'Łukasz Pacocha', role: 'akrobatyka, judo, ratownik' },
    ],
    trainers_image_url: '/images/miasta/jaslo-biecz-trenerzy.jpg',
    first_training: [
      { title: 'Strój sportowy i woda', desc: 'Ćwiczymy boso lub w skarpetkach.' },
      { title: 'Rozgrzewka', desc: 'Wspólny start całej grupy z trenerami.' },
      { title: 'Podstawy akrobatyki', desc: 'Przewroty i bezpieczne lądowania na AirTracku.' },
      { title: 'Informacja dla rodzica', desc: 'Trener podpowie, która grupa będzie najlepsza.' },
    ],
    benefits: ['lepsza sylwetka', 'motoryka', 'równowaga', 'orientacja w przestrzeni', 'zaangażowanie'],
    videos: [
      {
        url: `${WP_UPLOADS}/2025/07/akrobatyka-jaslo.mp4`,
        poster: '/images/miasta/jaslo-zajawka.jpg',
        label: 'Akrobatyka Jasło w akcji',
      },
    ],
  },

  biecz: {
    id: 'fallback-biecz',
    location_id: '',
    slug: 'biecz',
    meta_title: 'Akrobatyka Biecz — zajęcia dla dzieci i dorosłych',
    meta_description:
      'Zajęcia akrobatyki w Bieczu dla dzieci od 4 lat, młodzieży i dorosłych. Małe grupy i doświadczeni trenerzy. Zapisz się na zajęcia próbne.',
    h1_title: 'Akrobatyka Biecz',
    hero_tagline: null,
    hero_content:
      '<p>Akrobatyka w Bieczu dla dzieci i młodzieży — od grup początkujących po zawodniczą. Małe grupy, dwóch trenerów i maty <strong>AirTrack</strong> na każdych zajęciach.</p>',
    main_content:
      '<p>Sekcja w Bieczu prowadzi pełną ścieżkę rozwoju: od pierwszych przewrotów w grupach naborowych, przez grupę podstawową i średniozaawansowaną, aż po treningi zawodnicze w poniedziałki i środy.</p>',
    schedule_content: null,
    groups_info: [
      { name: 'Acro Biecz NABÓR (nowe dzieci)', days: 'pn', hours: '17:20–18:20', age: 'od 6 lat', level: 'grupa początkująca', enrolling: true },
      { name: 'Acro Biecz NABÓR 2 (nowe dzieci)', days: 'śr', hours: '17:20–18:20', age: 'od 6 lat', level: 'grupa początkująca', enrolling: true },
      { name: 'Acro Biecz 1', days: 'pn', hours: '18:20–19:20', age: 'od 7 lat', level: 'grupa podstawowa (kontynuacja)' },
      { name: 'Acro Biecz 1.1', days: 'śr', hours: '18:20–19:20', age: 'od 7 lat', level: 'grupa podstawowa (kontynuacja)' },
      { name: 'Acro Biecz 2', days: 'pn · śr', hours: '18:20–19:20', level: 'średniozaawansowana (kontynuacja)' },
      { name: 'Acro Biecz 3', days: 'pn · śr', hours: '19:20–20:20', level: 'grupa zaawansowana (kontynuacja)' },
    ],
    faq: [
      {
        question: 'Od ilu lat są zajęcia w Bieczu?',
        answer: 'Grupy naborowe przyjmują dzieci od 6. roku życia — w poniedziałki i środy o 17:20.',
      },
      {
        question: 'Gdzie dokładnie odbywają się treningi?',
        answer: 'Na Hali Sportowej przy Zespole Szkół Zawodowych im. Świętej Jadwigi Królowej, ul. Tysiąclecia w Bieczu.',
      },
      {
        question: 'Jak wygląda zapis?',
        answer: 'Wybierz grupę z listy i wyślij zgłoszenie przez system AIPAX. Nabór i kontynuacja — ten sam formularz.',
      },
      {
        question: 'Jak płacić za zajęcia?',
        answer: 'Do 10. dnia miesiąca przelewem na konto Stowarzyszenia Air Squad; po terminie doliczane jest 30 zł.',
      },
    ],
    aipax_form_id: '452fa7be-ee8c-4573-8849-7051c37607ab',
    is_published: true,
    created_at: '',
    updated_at: '',
    city_name: 'Biecz',
    city_locative: 'w Bieczu',
    training_days_label: 'poniedziałki i środy',
    group_ratio_label: '12 uczestników na trenera',
    pricing_hide_plans: ['Premium'],
    pricing_hide_drop_ins: ['Open Training', 'Pakiet 4 treningi'],
    pricing_enrol_via_aipax: true,
    hero_image_url: '/images/miasta/biecz-hero.jpg',
    hero_video_url: `${WP_UPLOADS}/2025/07/akro-biecz.mp4`,
    hall: {
      name: 'Hala Sportowa (ZSZ im. Św. Jadwigi Królowej)',
      address: 'ul. Tysiąclecia',
      city: 'Biecz',
      mapQuery: 'Hala Sportowa, Zespół Szkół Zawodowych im. Świętej Jadwigi Królowej, Tysiąclecia, Biecz',
    },
    trainers: [
      { name: 'Gabriel Myśliwiec', role: 'akrobatyka, tricking' },
      { name: 'Agnieszka Sobczyk', role: 'samoobrona, judo, trening personalny' },
      { name: 'Łukasz Pacocha', role: 'akrobatyka, judo, ratownik' },
    ],
    trainers_image_url: '/images/miasta/jaslo-biecz-trenerzy.jpg',
    first_training: [
      { title: 'Wygodny strój', desc: 'Plus woda — nic więcej nie trzeba.' },
      { title: 'Wspólna rozgrzewka', desc: 'Całą grupą, pod okiem trenerów.' },
      { title: 'Pierwsze elementy', desc: 'Przewroty i podstawy na miękkich matach.' },
      { title: 'Kwalifikacja do grupy', desc: 'O przydziale ostatecznie decyduje trener.' },
    ],
    benefits: ['postawa', 'koordynacja', 'równowaga', 'pewność siebie', 'praca zespołowa'],
    videos: [
      {
        url: `${WP_UPLOADS}/2025/07/akro-biecz.mp4`,
        poster: '/images/miasta/biecz-zajawka.jpg',
        label: 'Akro Biecz — zajawka',
      },
    ],
  },

  brzostek: {
    id: 'fallback-brzostek',
    location_id: '',
    slug: 'brzostek',
    meta_title: 'Akrobatyka Brzostek — zajęcia dla dzieci i dorosłych',
    meta_description:
      'Zajęcia akrobatyki w Brzostku dla dzieci od 4 lat, młodzieży i dorosłych. Małe grupy i doświadczeni trenerzy. Zapisz się na zajęcia próbne.',
    h1_title: 'Akrobatyka Brzostek',
    hero_tagline: null,
    hero_content:
      '<p>Treningi akrobatyki w Hali Widowiskowo-Sportowej w Brzostku — od grupy naborowej dla dzieci od 6 lat po grupę zawodniczą. Zajęcia na profesjonalnych matach <strong>AirTrack</strong>.</p>',
    main_content:
      '<p>Zapisy online obowiązują wszystkich uczestników — zarówno nowe dzieci, jak i kontynuujących. O ostatecznej kwalifikacji do grupy decyduje trener prowadzący sekcję.</p>',
    schedule_content: null,
    groups_info: [
      { name: 'Acro Brzostek NABÓR', days: 'czw', hours: '16:00–17:00', age: 'od 6 lat', level: 'nowe dzieci', enrolling: true },
      { name: 'Acro Brzostek I', days: 'czw', hours: '17:00–18:00', age: 'od 7 lat', level: 'średnio-zaawansowana' },
      { name: 'Acro Brzostek II', days: 'wt 15:45–17:00 · czw', hours: '18:00–19:00', level: 'grupa zaawansowana' },
    ],
    faq: [
      {
        question: 'Kiedy trenuje grupa naborowa w Brzostku?',
        answer: 'W czwartki o 16:00 — dla dzieci od 6. roku życia. Grupy zaawansowane trenują też we wtorki.',
      },
      {
        question: 'Gdzie odbywają się zajęcia?',
        answer: 'W Hali Widowiskowo-Sportowej w Brzostku, na profesjonalnym sprzęcie AirTrack.',
      },
      {
        question: 'Jak zapisać dziecko?',
        answer: 'Wybierz grupę i wyślij zgłoszenie online przez AIPAX. Zapisy obowiązują wszystkich — także kontynuujących.',
      },
      {
        question: 'Jak wyglądają płatności?',
        answer: 'Do 10. dnia miesiąca za następny miesiąc (po terminie +30 zł) — przelew lub gotówka u trenera.',
      },
    ],
    aipax_form_id: AIPAX_FORM_ID,
    is_published: true,
    created_at: '',
    updated_at: '',
    city_name: 'Brzostek',
    city_locative: 'w Brzostku',
    hero_image_url: '/images/miasta/brzostek-hero.jpg',
    hall: {
      name: 'Hala Widowiskowo-Sportowa w Brzostku',
      address: 'Hala Widowiskowo-Sportowa',
      city: 'Brzostek',
      mapQuery: 'Hala Widowiskowo-Sportowa Brzostek',
    },
    trainers: [{ name: 'Zespół trenerski Air Squad', role: 'trenerzy sekcji Brzostek' }],
    trainers_image_url: '/images/miasta/brzostek-trenerzy.jpg',
    first_training: [
      { title: 'Strój i woda', desc: 'Wygodny strój sportowy wystarczy na start.' },
      { title: 'Rozgrzewka z grupą', desc: 'Wprowadzenie w trening pod okiem trenerów.' },
      { title: 'Podstawy na AirTracku', desc: 'Bezpieczne przewroty i pierwsze skoki.' },
      { title: 'Dobór poziomu', desc: 'Trener zdecyduje o właściwej grupie dla dziecka.' },
    ],
    benefits: ['motoryka', 'skoczność', 'równowaga', 'koncentracja', 'dyscyplina'],
    videos: [
      {
        url: `${WP_UPLOADS}/2025/07/VID_20250725_102259_049.mp4`,
        poster: '/images/miasta/brzostek-zajawka.jpg',
        label: 'Trening sekcji — zajawka',
      },
    ],
  },

  pilzno: {
    id: 'fallback-pilzno',
    location_id: '',
    slug: 'pilzno',
    meta_title: 'Akrobatyka Pilzno — zajęcia dla dzieci i dorosłych',
    meta_description:
      'Zajęcia akrobatyki w Pilźnie dla dzieci od 4 lat, młodzieży i dorosłych. Małe grupy i doświadczeni trenerzy. Zapisz się na zajęcia próbne.',
    h1_title: 'Akrobatyka Pilzno',
    hero_tagline: null,
    hero_content:
      '<p>ACRO Pilzno — wtorkowe treningi akrobatyki w Strzegocicach. Zajęcia maksymalnie 25-osobowe na profesjonalnym sprzęcie <strong>AirTrack</strong>, prowadzone przez dwóch wykwalifikowanych trenerów.</p>',
    main_content:
      '<p>Trening akrobatyki w Pilźnie to poprawa postawy, rozwój motoryki i orientacji przestrzennej, a przy tym nauka pracy zespołowej, koncentracji i dyscypliny — od 6. roku życia po grupy zaawansowane.</p>',
    schedule_content: null,
    groups_info: [
      { name: 'ACRO Pilzno NABÓR', days: 'wt', hours: '18:00–19:00', age: 'od 6 lat', level: 'grupa naborowa', enrolling: true },
      { name: 'ACRO Pilzno 1', days: 'wt', hours: '18:00–19:00', age: 'od 7 lat', level: 'poziom podstawowy' },
      { name: 'ACRO Pilzno 2', days: 'wt', hours: '19:00–20:00', age: 'od 10 lat', level: 'średnio zaawansowana' },
      { name: 'ACRO Pilzno 3', days: 'wt', hours: '19:00–20:00', age: 'od 10 lat', level: 'grupa zaawansowana' },
    ],
    faq: [
      {
        question: 'Kiedy odbywają się treningi w Pilźnie?',
        answer: 'We wtorki: grupy młodsze 18:00–19:00, grupy starsze 19:00–20:00 — w Szkole Podstawowej w Strzegocicach.',
      },
      {
        question: 'Od ilu lat można zapisać dziecko?',
        answer: 'Grupa naborowa przyjmuje dzieci od 6. roku życia; grupy zaawansowane od 10 lat.',
      },
      {
        question: 'Jak duże są grupy?',
        answer: 'Maksymalnie 25 osób — zawsze z dwoma wykwalifikowanymi trenerami i sprzętem AirTrack.',
      },
      {
        question: 'Jak płacić za zajęcia?',
        answer: 'Do 10. dnia miesiąca z góry (po terminie +30 zł), na konto Stowarzyszenia Air Squad.',
      },
    ],
    aipax_form_id: AIPAX_FORM_ID,
    is_published: true,
    created_at: '',
    updated_at: '',
    city_name: 'Pilzno',
    city_locative: 'w Pilźnie',
    hero_image_url: '/images/miasta/pilzno-hero.jpg',
    hall: {
      name: 'Szkoła Podstawowa w Strzegocicach',
      address: 'Strzegocice 54',
      city: 'Pilzno',
      mapQuery: 'Szkoła Podstawowa Strzegocice 54',
    },
    first_training: [
      { title: 'Wygodny strój i woda', desc: 'Ćwiczymy boso lub w skarpetkach.' },
      { title: 'Rozgrzewka', desc: 'Wspólny start z całą grupą.' },
      { title: 'Pierwsze ćwiczenia', desc: 'Podstawy akrobatyki na matach AirTrack.' },
      { title: 'Przydział do grupy', desc: 'Trener dobierze poziom po pierwszych zajęciach.' },
    ],
    benefits: ['postawa', 'motoryka', 'orientacja przestrzenna', 'praca zespołowa', 'koncentracja'],
    gallery: [
      { url: '/images/miasta/pilzno-galeria-1.jpg', caption: 'Trening ACRO Pilzno' },
      { url: '/images/miasta/pilzno-galeria-2.jpg', caption: 'Ćwiczenia na sali' },
      { url: '/images/miasta/pilzno-galeria-3.jpg', caption: 'Zajęcia grupowe' },
      { url: '/images/miasta/pilzno-galeria-4.jpg', caption: 'Akrobatyka dzieci' },
    ],
    videos: [
      {
        url: `${WP_UPLOADS}/2024/07/rolka-akro-dzien-34-1.mp4`,
        poster: '/images/miasta/pilzno-zajawka.jpg',
        label: 'Rolka z treningów',
      },
    ],
  },

  tyczyn: {
    id: 'fallback-tyczyn',
    location_id: '',
    slug: 'tyczyn',
    meta_title: 'Akrobatyka Tyczyn — zajęcia dla dzieci i dorosłych',
    meta_description:
      'Zajęcia akrobatyki w Tyczynie dla dzieci od 4 lat, młodzieży i dorosłych. Małe grupy i doświadczeni trenerzy. Zapisz się na zajęcia próbne.',
    h1_title: 'Akrobatyka Tyczyn',
    hero_tagline: null,
    hero_content:
      '<p>Wtorkowe treningi akrobatyki w Tyczynie — grupy maksymalnie 20-osobowe dla dzieci od 6. roku życia, na profesjonalnym sprzęcie <strong>AirTrack</strong>. Zajęcia wzbogacone o tricking.</p>',
    main_content:
      '<p>Akrobatyka w Tyczynie to poprawa sylwetki i wad postawy, rozwój zdolności motorycznych, równowagi i orientacji w przestrzeni. Uczymy pracy indywidualnej i zespołowej, skupienia oraz dyscypliny.</p>',
    schedule_content: null,
    groups_info: [
      { name: 'Acro Tyczyn — grupy wg wieku', days: 'wt', hours: '15:30–18:30', age: 'od 6 lat', enrolling: true },
    ],
    faq: [
      {
        question: 'Kiedy odbywają się zajęcia w Tyczynie?',
        answer: 'We wtorki w godzinach 15:30–18:30 — grupy podzielone według wieku i poziomu.',
      },
      {
        question: 'Gdzie trenujemy?',
        answer: 'W Miejsko-Gminnym Ośrodku Kultury w Tyczynie, na profesjonalnych matach AirTrack.',
      },
      {
        question: 'Jak zapisać dziecko?',
        answer: 'Online przez system AIPAX (wymagane założenie konta). Pytania: trener Gabriel, tel. 722 248 546.',
      },
      {
        question: 'Jak wyglądają płatności?',
        answer: 'Do 10. dnia miesiąca przelewem na konto Stowarzyszenia Air Squad; po terminie doliczane jest 30 zł.',
      },
    ],
    aipax_form_id: AIPAX_FORM_ID,
    is_published: true,
    created_at: '',
    updated_at: '',
    city_name: 'Tyczyn',
    city_locative: 'w Tyczynie',
    hero_image_url: '/images/miasta/tyczyn-hero.jpg',
    hall: {
      name: 'Miejsko-Gminny Ośrodek Kultury w Tyczynie',
      address: 'MGOK Tyczyn',
      city: 'Tyczyn',
      mapQuery: 'Miejsko-Gminny Ośrodek Kultury Tyczyn',
    },
    first_training: [
      { title: 'Strój sportowy i woda', desc: 'Nic więcej nie potrzeba na pierwszy trening.' },
      { title: 'Rozgrzewka z grupą', desc: 'Wprowadzenie pod okiem trenerów.' },
      { title: 'Bezpieczne podstawy', desc: 'Przewroty i lądowania na miękkich matach.' },
      { title: 'Dobór grupy wiekowej', desc: 'Trener przydzieli dziecko do właściwej grupy.' },
    ],
    benefits: ['sylwetka', 'motoryka', 'równowaga', 'skupienie', 'dyscyplina'],
    videos: [
      {
        url: `${WP_UPLOADS}/2024/07/rolka-akro-dzien-34-1.mp4`,
        poster: '/images/miasta/tyczyn-zajawka.jpg',
        label: 'Rolka z treningów',
      },
    ],
  },
}
