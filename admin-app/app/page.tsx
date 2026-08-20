import { redirect } from 'next/navigation'

// Panel mieszka pod /admin/* (ścieżki bez zmian po wydzieleniu z airsquad-web),
// więc korzeń hosta tylko przekierowuje. Autoryzacją zajmuje się proxy.ts.
export default function AdminRootRedirect() {
  redirect('/admin')
}
