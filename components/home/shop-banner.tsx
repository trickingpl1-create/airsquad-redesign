import Link from 'next/link'

// Baner na stronie głównej (między paskiem dyscyplin a sekcją „Zespół")
// przekierowujący do /sklep. Zdjęcie gadżetów w tle (format banerowy 2000×364),
// przyciemnienie od lewej pod tekst, cała powierzchnia klikalna.
export function ShopBanner() {
  return (
    <section className="relative bg-background px-6 py-10 md:px-10 md:py-14">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/sklep"
          className="group relative block overflow-hidden rounded-3xl border border-border focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-cyan"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- eksport statyczny, images.unoptimized */}
          <img
            src="/images/sklep-merch.webp"
            alt="Gadżety i odzież Air Squad — koszulki, bluza, kubek, worek, skarpety i opaski"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          {/* Przyciemnienie od lewej — czytelność tekstu, produkty widoczne po prawej */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(10,10,22,0.94) 0%, rgba(10,10,22,0.72) 40%, rgba(10,10,22,0.18) 72%, transparent 100%)',
            }}
          />
          <div className="relative flex min-h-[260px] flex-col justify-center gap-3 p-8 md:min-h-[340px] md:p-12">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-violet-soft">
              Sklep Air Squad
            </span>
            <span
              className="display-bold max-w-lg text-3xl leading-tight text-white md:text-4xl lg:text-5xl"
              style={{ fontWeight: 400 }}
            >
              Gadżety i odzież{' '}
              <span className="gradient-text" style={{ fontWeight: 400 }}>
                Air Squad
              </span>
              .
            </span>
            <span className="max-w-md text-sm leading-relaxed text-white/80 md:text-base">
              Koszulki, bluzy, kubki i akcesoria klubu. Odbiór i płatność u trenera.
            </span>
            <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white transition-transform group-hover:scale-[1.03]">
              Do sklepu →
            </span>
          </div>
        </Link>
      </div>
    </section>
  )
}
