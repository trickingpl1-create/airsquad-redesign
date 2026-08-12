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

export function HowAudienceSection() {
  return (
    <section
      id="dla-kogo"
      className="relative overflow-hidden bg-background px-6 py-24 md:px-10 md:py-32"
    >
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 md:mb-14">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-pink md:text-xs">
            Dla kogo
          </p>
          <h2 className="display-bold mt-3 text-balance text-4xl text-foreground md:text-5xl lg:text-6xl" style={{ fontWeight: 400 }}>
            Trening dla{' '}
            <span className="gradient-text" style={{ fontWeight: 400 }}>każdego wieku</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {audience.map((a) => (
            <div
              key={a.title}
              className="group relative flex min-h-60 flex-col justify-end overflow-hidden rounded-3xl border bg-card p-8"
              style={{
                borderColor: `color-mix(in oklch, ${a.accent} 30%, transparent)`,
              }}
            >
              {/* Semitransparent photo */}
              <div
                aria-hidden
                className="absolute inset-0 bg-cover bg-center opacity-[0.20] transition-opacity duration-500 group-hover:opacity-[0.32]"
                style={{ backgroundImage: `url('${a.photo}')` }}
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at 70% 20%, color-mix(in oklch, ${a.accent} 20%, transparent), transparent 60%)`,
                }}
              />
              <div
                aria-hidden
                className="halftone-overlay absolute inset-0 opacity-[0.06]"
                style={{ color: a.accent }}
              />
              <span
                aria-hidden
                className="stat-number absolute right-8 top-7 text-5xl opacity-85 md:text-6xl"
                style={{ color: a.accent, fontWeight: 400 }}
              >
                {a.num}
              </span>
              <div className="relative">
                <div
                  className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border bg-white/5"
                  style={{
                    borderColor: `color-mix(in oklch, ${a.accent} 35%, transparent)`,
                  }}
                >
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: a.accent }}
                  />
                </div>
                <h3 className="display-bold m-0 text-2xl text-foreground md:text-[1.75rem]">
                  {a.title}
                </h3>
                {a.desc && (
                  <p className="mt-3 text-sm font-medium leading-relaxed text-muted-foreground">
                    {a.desc}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
