import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If already authenticated, redirect to admin dashboard
  if (user) {
    redirect('/admin')
  }

  return <div className="light">{children}</div>
}
