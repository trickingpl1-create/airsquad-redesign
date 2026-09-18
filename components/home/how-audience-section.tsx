const audience = [
  {
    title: 'Dzieci 7–10 lat',
    num: '7–10',
    desc: 'Bezpieczne podstawy, miękkie maty, krótkie sesje. Pierwsza akrobatyka w życiu — bez stresu.',
    accent: 'var(--primary)',
    photo: '/images/old-site/dzieci-airtrack.jpg',
  },
  {
    title: 'Młodzież 11–17',
    num: '11–17',
    desc: 'Tricking, tumbling zaawansowany, pierwsze konkursy i pokazy. Mocne zaplecze techniczne i progres widoczny co miesiąc.',
    accent: 'var(--cyan)',
    photo: '/images/old-site/mlodziez-oboz.jpg',
  },
  {
    title: 'Dorośli i rodziny',
    num: '18+',
    desc: 'Wieczorne grupy dla dorosłych. Akrobatyka w każdym wieku — w komfortowym tempie.',
    accent: 'var(--pink)',
    photo: '/images/old-site/dorosli-ekipa.jpg',
  },
] as const

// Skos cięcia między kadrami (px) — tylko na desktopie; ten sam język wizualny
// co pas dyscyplin (components/home/disciplines-reveal.tsx). Na mobilce slice'y
// układają się w pion, bez skosu, z opisem zawsze widocznym.
const SKEW = 34
const CLIP_RIGHT = `polygon(0 0, 100% 0, calc(100% - ${SKEW}px) 100%, 0 100%)`
const CLIP_LEFT = `polygon(${SKEW}px 0, 100% 0, 100% 100%, 0 100%)`

export function HowAudienceSection() {
  const last = audience.length - 1
  return (
    <section
      id="dla-kogo"
      className="relative overflow-hidden bg-background px-6 py-16 md:px-10 md:py-20"
    >
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 md:mb-10">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-pink md:text-xs">
            Dla kogo
          </p>
          <h2 className="display-bold mt-2.5 text-balance text-3xl text-foreground md:text-4xl lg:text-5xl" style={{ fontWeight: 400 }}>
            Trening dla{' '}
            <span className="gradient-text" style={{ fontWeight: 400 }}>każdego wieku</span>.
          </h2>
        </div>

        {/* Pas grup wiekowych — nazwa i wiek widoczne zawsze, opis po najechaniu.
            Opis zostaje w DOM (opacity, nie display:none). Na mobilce w pionie. */}
        <div className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-black md:h-[18rem] md:flex-row">
          {audience.map((a, i) => (
            <div
              key={a.title}
              className={`group/slice relative flex min-h-40 w-full flex-col justify-end overflow-hidden p-6 text-white md:min-h-0 md:w-auto md:grow md:basis-0 md:p-7 md:transition-[flex-grow,filter] md:duration-500 md:ease-out md:hover:z-10 md:hover:grow-[2.6] md:[filter:saturate(0.92)_brightness(0.76)] md:hover:[filter:none] md:[clip-path:var(--clip)] motion-reduce:md:transition-none ${
                i === 0 ? '' : 'md:-ml-[34px]'
              }`}
              style={{ ['--clip' as string]: i === last ? CLIP_LEFT : CLIP_RIGHT }}
            >
              <span
                aria-hidden
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${a.photo}')` }}
              />
              <span
                aria-hidden
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, rgba(8,4,20,0.94), rgba(8,4,20,0.45) 52%, rgba(8,4,20,0.2) 100%), radial-gradient(circle at 75% 18%, color-mix(in oklch, ${a.accent} 34%, transparent), transparent 58%)`,
                }}
              />
              <span
                aria-hidden
                className="halftone-overlay absolute inset-0 opacity-[0.06]"
                style={{ color: a.accent }}
              />
              <span
                aria-hidden
                className="stat-number absolute right-6 top-5 text-4xl [text-shadow:0_2px_12px_rgba(0,0,0,0.8)] md:text-5xl"
                style={{ color: a.accent, fontWeight: 400 }}
              >
                {a.num}
              </span>
              <span className="relative">
                <span
                  className="display-bold block text-xl leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] md:text-2xl"
                  style={{ fontWeight: 400 }}
                >
                  {a.title}
                </span>
                <span className="mt-2 block max-w-[24rem] text-[13px] leading-relaxed text-white/95 [text-shadow:0_1px_6px_rgba(0,0,0,0.85)] transition-opacity duration-300 md:opacity-0 md:group-hover/slice:opacity-100 motion-reduce:transition-none">
                  {a.desc}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
