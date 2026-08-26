// Supabase Auth loguje wyłącznie po adresie e-mail (`signInWithPassword`),
// a panel ma pole „Login" z samą nazwą użytkownika. Domenę doklejamy tutaj,
// żeby konwersja była w jednym miejscu — i formularz, i wyświetlanie nazwy
// zalogowanego użytkownika muszą się jej trzymać.
//
// Konto w Supabase może mieć dowolny adres (Authentication → Users → Add user,
// z zaznaczonym „Auto Confirm User"). Jeśli jest na domenie airsquad.pl,
// wystarczy sama nazwa użytkownika. Na każdej innej domenie — np. koncie
// gmail — w polu logowania trzeba wpisać PEŁNY adres; wtedy doklejanie
// domeny się nie uruchamia.
export const LOGIN_DOMAIN = 'airsquad.pl'

/** „jankowalski" → „jankowalski@airsquad.pl"; pełny adres zostaje bez zmian. */
export function loginToEmail(login: string): string {
  const value = login.trim()
  if (!value) return value
  return value.includes('@') ? value : `${value}@${LOGIN_DOMAIN}`
}

/** Odwrotnie — żeby nagłówek panelu pokazywał sam login, nie doklejoną domenę. */
export function emailToLogin(email: string | undefined): string {
  if (!email) return ''
  const suffix = `@${LOGIN_DOMAIN}`
  return email.endsWith(suffix) ? email.slice(0, -suffix.length) : email
}
