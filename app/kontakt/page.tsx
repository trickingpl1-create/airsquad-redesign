import { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Sticker } from '@/components/ui/sticker'
import { ContactForm } from './contact-form'
import { MapPin, Phone, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kontakt | Air Squad',
  description: 'Skontaktuj się z Air Squad. Telefon, email i formularz kontaktowy.',
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background pt-24">
        {/* Hero band */}
        <section className="relative overflow-hidden border-b-2 border-foreground bg-gradient-to-br from-cyan via-primary to-accent">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-cyan/30 blur-3xl"
          />
          <div className="container relative mx-auto px-4 py-20 md:py-24">
            <Sticker variant="white" rotate="left" size="sm" className="mb-6">
              Odpowiadamy w 24h
            </Sticker>
            <h1 className="font-[family-name:var(--font-display)] text-6xl font-black uppercase leading-[0.9] tracking-tighter text-primary-foreground sm:text-7xl md:text-8xl">
              kontakt
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium text-primary-foreground/85 md:text-xl">
              Pytania o zapisy, grupy, lokalizacje? Napisz lub zadzwoń.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            <a
              href="tel:+48728559101"
              className="group block border-2 border-foreground bg-card p-6 shadow-sticker transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-sticker-lg"
            >
              <Phone className="h-7 w-7 text-primary" aria-hidden />
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-xl font-black uppercase tracking-tighter text-foreground">
                Telefon
              </h2>
              <p className="mt-2 text-base font-bold text-foreground transition-colors group-hover:text-primary">
                728 559 101
              </p>
              <p className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                722 248 546
              </p>
            </a>

            <a
              href="mailto:kontakt@airsquad.pl"
              className="group block border-2 border-foreground bg-card p-6 shadow-sticker transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-sticker-lg"
            >
              <Mail className="h-7 w-7 text-primary" aria-hidden />
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-xl font-black uppercase tracking-tighter text-foreground">
                Email
              </h2>
              <p className="mt-2 break-all text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                kontakt@airsquad.pl
              </p>
            </a>

            <div className="border-2 border-foreground bg-card p-6 shadow-sticker">
              <MapPin className="h-7 w-7 text-primary" aria-hidden />
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-xl font-black uppercase tracking-tighter text-foreground">
                Siedziba
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">ul. Sportowa 15</p>
              <p className="text-sm text-muted-foreground">35-001 Rzeszów</p>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-3xl border-2 border-foreground bg-card p-8 shadow-sticker-lg md:p-12">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-black uppercase tracking-tighter text-foreground md:text-4xl">
              Wyślij wiadomość
            </h2>
            <p className="mt-2 text-muted-foreground">Odpowiadamy w 24 godziny.</p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
