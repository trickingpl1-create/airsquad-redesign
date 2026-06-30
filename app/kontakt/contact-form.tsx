'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      // In a real app, you'd send this to an email service or backend
      // For now, we'll just log it and show success
      console.log('[v0] Contact form submitted:', formData)
      
      // Simulate sending email
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to send')

      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      console.error('[v0] Error sending message:', error)
      alert('Błąd przy wysyłaniu wiadomości. Spróbuj zadzwonić.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {submitted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded text-green-800">
          Wiadomość wysłana! Skontaktujemy się z tobą wkrótce.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">Imię i nazwisko *</label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Jan Kowalski"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Email *</label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="jan@example.com"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Telefon</label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="123 456 789"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Temat *</label>
          <Input
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Np. Pytanie o zajęcia"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Wiadomość *</label>
          <Textarea
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Twoja wiadomość..."
            rows={5}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full md:w-auto">
          {loading ? 'Wysyłanie...' : 'Wyślij wiadomość'}
        </Button>
      </form>
    </>
  )
}
