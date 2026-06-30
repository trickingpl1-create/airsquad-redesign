import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Air Squad — Akrobatyka, Tricking, Longboard'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0A0A0F 0%, #12082a 50%, #0A0A0F 100%)',
          position: 'relative',
        }}
      >
        {/* Purple glow blob top-right */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)',
          }}
        />
        {/* Cyan glow blob bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)',
          }}
        />

        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/air-squad-logo-glow-JwTP0DkANWLxaEzjY1aqHNwaZgP7sg.png"
          alt="Air Squad logo"
          width={360}
          height={171}
          style={{ objectFit: 'contain' }}
        />

        {/* Tagline */}
        <div
          style={{
            marginTop: 32,
            fontSize: 28,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Akrobatyka · Tricking · Longboard · Obozy
        </div>

        {/* URL */}
        <div
          style={{
            marginTop: 16,
            fontSize: 18,
            color: 'rgba(6,182,212,0.8)',
            letterSpacing: '0.15em',
          }}
        >
          airsquad.pl
        </div>
      </div>
    ),
    { ...size },
  )
}
