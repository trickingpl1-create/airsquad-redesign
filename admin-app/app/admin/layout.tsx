import type { Metadata } from 'next'

// Wspólny layout całego /admin/* — tylko noindex. Autoryzacja żyje w (panel)/layout.tsx,
// żeby nie obejmowała strony logowania (inaczej redirect('/admin/login') zapętla się na sobie).
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
