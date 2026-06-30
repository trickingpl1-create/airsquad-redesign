'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/types/database'
import { Card } from '@/components/ui/card'

type InstagramPost = Database['public']['Tables']['instagram_posts']['Row']

export function InstagramFeed({ limit = 6 }: { limit?: number }) {
  const supabase = createClient()
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('instagram_posts')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(limit)

      if (error) {
        console.error('[v0] Error fetching Instagram posts:', error)
        return
      }

      setPosts(data || [])
      setLoading(false)
    }

    fetchPosts()
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
