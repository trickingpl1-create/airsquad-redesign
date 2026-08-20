'use client'

import { useEffect, useState } from 'react'
import { getBrowserSupabaseClient } from '@/lib/supabase/client'
import type { InstagramPost } from '@/lib/types/database'
import { Card } from '@/components/ui/card'

export function InstagramFeed({ limit = 6 }: { limit?: number }) {
  const supabase = getBrowserSupabaseClient()
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Brak skonfigurowanego Supabase — od razu stan pusty zamiast wiszącego
    // „Ładowanie…" (fetch i tak poleciałby na martwy host).
    if (!supabase) {
      setLoading(false)
      return
    }

    async function fetchPosts(client: NonNullable<typeof supabase>) {
      try {
        const { data, error } = await client
          .from('instagram_posts')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(limit)

        if (error) throw error
        setPosts(data ?? [])
      } catch (error) {
        console.error('[air-squad] Nie udało się pobrać postów z Instagrama:', error)
      } finally {
        // Zawsze — inaczej błąd zostawia komponent na „Ładowanie…" na zawsze
        setLoading(false)
      }
    }

    fetchPosts(supabase)
  }, [supabase, limit])

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Ładowanie...</div>
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Brak postów na Instagramie
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {posts.map(post => (
        <a
          key={post.id}
          href={post.post_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden rounded-lg aspect-square"
        >
          <img
            src={post.image_url}
            alt={post.caption || 'Instagram post'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          {post.caption && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-end p-4 opacity-0 group-hover:opacity-100">
              <p className="text-white text-sm line-clamp-3">{post.caption}</p>
            </div>
          )}
        </a>
      ))}
    </div>
  )
}
