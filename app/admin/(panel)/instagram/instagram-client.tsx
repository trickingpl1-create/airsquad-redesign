'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, Edit2, Plus } from 'lucide-react'

type InstagramPost = Database['public']['Tables']['instagram_posts']['Row']

export function InstagramClient() {
  const supabase = createClient()
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<InstagramPost | null>(null)
  const [form, setForm] = useState({ post_url: '', image_url: '', caption: '' })

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('instagram_posts')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('[v0] Error fetching posts:', error)
      return
    }

    setPosts(data || [])
    setLoading(false)
  }

  async function handleSave() {
    if (!form.post_url || !form.image_url) {
      alert('Uzupełnij wszystkie wymagane pola')
      return
    }

    if (editing) {
      const { error } = await supabase
        .from('instagram_posts')
        .update({
          post_url: form.post_url,
          image_url: form.image_url,
          caption: form.caption,
        })
        .eq('id', editing.id)

      if (error) {
        console.error('[v0] Error updating post:', error)
        return
      }
    } else {
      const { error } = await supabase
        .from('instagram_posts')
        .insert({
          post_url: form.post_url,
          image_url: form.image_url,
          caption: form.caption,
        })

      if (error) {
        console.error('[v0] Error creating post:', error)
        return
      }
    }

    setForm({ post_url: '', image_url: '', caption: '' })
    setEditing(null)
    fetchPosts()
  }

  async function handleDelete(id: string) {
    if (!confirm('Usunąć ten post?')) return

    const { error } = await supabase
      .from('instagram_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[v0] Error deleting post:', error)
      return
    }

    fetchPosts()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Posty Instagram</h1>
        <p className="text-muted-foreground">Zarządzaj postami wyświetlanymi na stronie</p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editing ? 'Edytuj post' : 'Dodaj nowy post'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">URL posta na Instagramie *</label>
            <Input
              value={form.post_url}
              onChange={(e) => setForm({ ...form, post_url: e.target.value })}
              placeholder="https://instagram.com/p/..."
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">URL obrazu *</label>
            <Input
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Opis (opcjonalnie)</label>
            <Textarea
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              placeholder="Dodatkowy opis..."
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave}>{editing ? 'Zapisz zmiany' : 'Dodaj post'}</Button>
            {editing && (
              <Button variant="outline" onClick={() => { setEditing(null); setForm({ post_url: '', image_url: '', caption: '' }) }}>
                Anuluj
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      {loading ? (
        <p className="text-muted-foreground">Ładowanie...</p>
      ) : (
        <div className="grid gap-4">
          {posts.map(post => (
            <Card key={post.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  {post.image_url && (
                    <img src={post.image_url} alt={post.caption || 'Post'} className="w-24 h-24 object-cover rounded" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium truncate">{post.caption || 'Brak opisu'}</p>
                    <p className="text-sm text-muted-foreground truncate">{post.post_url}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing(post)
                        setForm({
                          post_url: post.post_url,
                          image_url: post.image_url,
                          caption: post.caption || '',
                        })
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
