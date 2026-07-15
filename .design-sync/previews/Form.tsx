'use client'

import { useForm } from 'react-hook-form'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Input,
  Button,
} from 'airsquad-ui'

// Marka nie ma jasnego motywu — patrz .design-sync/conventions.md.
const canvas = { background: 'var(--background)', padding: 24 }

type TrainerFormValues = {
  imie: string
  email: string
}

// Formularz dodania trenera w panelu admina — pola poprawne, bez błędów.
export function Default() {
  const form = useForm<TrainerFormValues>({
    defaultValues: { imie: 'Patryk Dębski', email: 'patryk@airsquad.pl' },
  })

  return (
    <div style={canvas}>
      <Form {...form}>
        <form style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
          <FormField
            control={form.control}
            name="imie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imię i nazwisko</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Widoczne na stronie trenerów.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adres e-mail</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" style={{ justifySelf: 'start' }}>
            Zapisz trenera
          </Button>
        </form>
      </Form>
    </div>
  )
}

type ContactFormValues = {
  imie: string
  telefon: string
  wiadomosc: string
}

// Formularz kontaktowy strony miasta — stan błędu walidacji.
export function WithErrors() {
  const form = useForm<ContactFormValues>({
    defaultValues: { imie: '', telefon: '', wiadomosc: '' },
    errors: {
      imie: { type: 'required', message: 'Podaj imię i nazwisko rodzica.' },
      telefon: { type: 'pattern', message: 'Podaj poprawny numer telefonu.' },
    },
  })

  return (
    <div style={canvas}>
      <Form {...form}>
        <form style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
          <FormField
            control={form.control}
            name="imie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imię i nazwisko rodzica</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="np. Anna Kowalska" aria-invalid />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telefon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon kontaktowy</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="np. 600 123 456" aria-invalid />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="wiadomosc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wiadomość</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Pytanie o zapisy do grupy AcroKids" />
                </FormControl>
                <FormDescription>Odpowiadamy zwykle w ciągu 1 dnia roboczego.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" style={{ justifySelf: 'start' }}>
            Wyślij wiadomość
          </Button>
        </form>
      </Form>
    </div>
  )
}
