// Konta klubu w social mediach — jedno źródło dla stopki, /kontakt/
// i Organization.sameAs na stronie głównej.
//
// Adresy potwierdzone 2026-10-06: Facebook = profil linkowany 7× przez starą
// stronę WordPress, YouTube = kanał „KLUB AIRSQUAD” (z niego pochodzą wszystkie
// filmy osadzone na stronie), Instagram = konto kanoniczne, TikTok = @air__squad
// (podwójne podkreślenie; linkuje do niego opis kanału YT klubu, bio konta
// prowadzi na airsquad.pl). Wcześniejsze placeholdery z szablonu
// (facebook.com/airsquad, youtube.com/@airsquad, tiktok.com/@airsquad)
// prowadziły do obcych kont.
export const SOCIALS = [
  {
    short: 'IG',
    name: 'Instagram',
    href: 'https://www.instagram.com/airsquad_akrobatyka/',
  },
  {
    short: 'FB',
    name: 'Facebook',
    href: 'https://www.facebook.com/KlubAirSquad',
  },
  {
    short: 'YT',
    name: 'YouTube',
    href: 'https://www.youtube.com/@klubairsquad',
  },
  {
    short: 'TT',
    name: 'TikTok',
    href: 'https://www.tiktok.com/@air__squad',
  },
] as const

export const SOCIAL_URLS = SOCIALS.map((s) => s.href)
