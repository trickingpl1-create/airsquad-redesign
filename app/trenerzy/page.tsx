import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SectionHeader } from '@/components/home/section-header'
import { TeamPhotoBackdrop } from '@/components/team/team-photo-backdrop'
import { TeamPortraitCard, initials, photoVariant } from '@/components/team/team-portrait-card'
import { TEAM, TEAM_FEATURED, TEAM_REST } from '@/lib/content/team'
import { TEAM_PHOTOS } from '@/lib/content/team-photos'

export const metadata = {
  alternates: { canonical: '/trenerzy/' },
  title: 'Trenerzy',
  description:
    'Kadra Air Squad — instruktorzy akrobatyki, trickingu i tumblingu: magistrowie WF, fizjoterapeuci i instruktorzy judo. Zajęcia w sześciu miastach Podkarpacia.',
}

export default function TrainersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* pt-24 = odstęp na przyklejony Header, jak na pozostałych podstronach */}
      <main className="flex-1 bg-background pt-24">
        {/*
          Hero: zdjęcia grupowe kadry przenikają pod nagłówkiem zamiast leżeć
          w osobnej galerii na dole strony. `tone="on-photo"` daje cały
          nagłówek na biało (bez gradientu drugiego członu) — domyślny
          `text-foreground` i `.gradient-text` nie trzymają kontrastu
          na przyciemnionej fotografii.
          Sekcja ma min-height, żeby przy braku zdjęć (pusty katalog
          public/images/kadra) nie zapadła się do samego tekstu.
        */}
        <section className="relative min-h-[26rem] overflow-hidden md:min-h-[32rem]">
          <TeamPhotoBackdrop photos={TEAM_PHOTOS} />
          <div className="container relative mx-auto px-4 pb-20 pt-12 md:pb-24 md:pt-16">
            <div className="max-w-2xl">
              <SectionHeader
                as="h1"
                tone="on-photo"
                className="mb-0 md:mb-0"
                kicker={`Kadra · ${TEAM.length} osób · Est. 2003`}
                kickerColorClass="text-cyan"
                title="Trenerzy, którym"
                gradientPart="ufają rodzice."
                titleFontWeight={400}
                gradientFontWeight={400}
              />
              <p className="mt-6 text-base leading-relaxed text-white/85 md:text-lg">
                Pasjonaci akrobatyki, którzy pamiętają, jak to jest być początkującym — i dlatego
                nikt u nas nie zaczyna od rzeczy, na którą nie jest gotowy. Pierwszy przewrót
                ćwiczy się tak samo uważnie jak salto: na miękkich matach{' '}
                <strong className="font-semibold text-white">AirTrack</strong>, w małej grupie,
                we własnym tempie.
              </p>
            </div>
          </div>
        </section>

        {/* Dalszy ciąg opisu — poza zdjęciem, żeby dłuższy tekst czytało się
            na spokojnym tle, a nie na fotografii. */}
        <section className="container mx-auto px-4 py-12 md:py-14">
          <div className="max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              Za tym stoją konkretne kwalifikacje: magistrowie wychowania fizycznego,
              fizjoterapeuci, instruktorzy akrobatyki i judo, ratownik. Na zajęciach pracuje
              dwóch trenerów, a grupy trzymamy w rygorze do dwunastu uczestników na trenera —
              dzięki temu każde dziecko dostaje poprawkę wtedy, kiedy jej potrzebuje, a nie
              pod koniec sezonu.
            </p>
            <p>
              Uczymy w sześciu miastach na Podkarpaciu, prowadzimy obozy Air Camp i zawody
              Air Meeting. Ten sam zespół, który stoi przy macie na treningu, jedzie potem
              z dziećmi na turnus.
            </p>
          </div>
        </section>

        {/* Osoby prowadzące klub — duże portrety, ten sam kafelek co na stronie
            głównej (components/team/team-portrait-card.tsx). Tu nazwiska są h2. */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-violet-soft">
            Prowadzą klub
          </p>
          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {TEAM_FEATURED.map((m) => (
              <TeamPortraitCard key={m.name} member={m} headingAs="h2" />
            ))}
          </div>
        </section>

        {/* Reszta kadry — na /trenerzy/ z rolami, w odróżnieniu od strony głównej,
            gdzie ta grupa jest tylko plakietkami z nazwiskiem. */}
        <section className="container mx-auto px-4 pb-4">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald">
            Kadra trenerska
          </p>
          <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_REST.map((m) => (
              <article
                key={m.name}
                className="flex items-center gap-4 rounded-3xl border border-border bg-card p-4"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-muted">
                  {m.photo ? (
                    // Awatar 64 px: wariant -w192 (8–12 kB) zamiast pełnego
                    // portretu 768×1365 (~300 kB); 192 = 3× gęstość ekranu.
                    <img
                      src={photoVariant(m.photo, 192)}
                      alt={m.name}
                      width={64}
                      height={64}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="display-bold grid h-full w-full place-items-center text-lg text-foreground/45"
                      style={{ fontWeight: 400 }}
                    >
                      {initials(m.name)}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <h2
                    className="display-bold text-base leading-tight text-foreground"
                    style={{ fontWeight: 400 }}
                  >
                    {m.name}
                  </h2>
                  <p className="mt-1 font-mono text-[10px] uppercase leading-relaxed tracking-[0.1em] text-violet-soft">
                    {m.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Osobnej galerii zdjęć grupowych już nie ma — te same cztery kadry
            przenikają w hero na górze strony (components/team/team-photo-backdrop.tsx).
            Powtarzanie ich niżej byłoby dubletem tej samej treści. */}

        {/* CTA */}
        <section className="container mx-auto px-4 pb-20 pt-4">
          <div
            className="rounded-3xl p-10 text-center text-primary-foreground shadow-[0_14px_36px_oklch(0.58_0.24_290/0.35)] md:p-14"
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            }}
          >
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white/75">
              Dołącz do zespołu
            </p>
            <p
              className="display-bold mt-3 text-3xl leading-tight md:text-4xl"
              style={{ fontWeight: 400 }}
            >
              Szukamy trenerów.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80">
              Masz doświadczenie w akrobatyce, trickingu albo gimnastyce i chcesz pracować
              z dziećmi? Napisz — odpowiadamy na każde zgłoszenie.
            </p>
            <Link
              href="/kontakt"
              className="mt-8 inline-block rounded-full border border-white/35 bg-white/10 px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/20"
            >
              Napisz do nas →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
