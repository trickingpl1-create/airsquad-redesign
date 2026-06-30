import Image from 'next/image'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.38 0.18 290 / 0.18), transparent)',
        }}
      />

      <div className="relative flex flex-col items-center gap-8">
        {/* Logo with pulse animation */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-0 animate-ping rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, #a855f7, transparent 70%)',
              animationDuration: '2s',
            }}
          />
          <Image
            src="/images/airsquad-logo.png"
            alt="Air Squad"
            width={200}
            height={95}
            className="relative h-[80px] w-auto object-contain drop-shadow-[0_0_30px_rgba(168,85,247,0.7)]"
            priority
          />
        </div>

        {/* Loading bar */}
        <div className="h-[2px] w-48 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
              animation: 'loading-bar 1.4s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0%   { width: 0%; margin-left: 0%; }
          50%  { width: 70%; margin-left: 15%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  )
}
