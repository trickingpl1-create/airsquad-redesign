"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

type IframeWrapperProps = {
  src: string
  title: string
  /** Wysokosc iframe w pikselach. Domyslnie 800. */
  height?: number
  /** Klasa CSS dla kontenera. */
  className?: string
}

/**
 * Wrapper na iframe (np. AIPAX) ze stanem ladowania i bledu.
 *
 * Po co osobny komponent:
 * - AIPAX iframe bedzie uzywany w 2-3 miejscach (zapisy, grafik, portal rodzica).
 * - Bez wrappera kazda strona musialaby duplikowac logike loadera + error state.
 *
 * Czego komponent NIE robi (swiadomie):
 * - nie ustawia sandbox - polityka bezpieczenstwa zalezy od konkretnego embeda
 *   i powinna byc decyzja per-uzycie, nie ukryta w wrapperze.
 * - nie obsluguje cross-origin postMessage - jak bedzie potrzebne, dodamy.
 */
export function IframeWrapper({ src, title, height = 800, className }: IframeWrapperProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")

  return (
    <div className={className} style={{ position: "relative", minHeight: height }}>
      {status === "loading" && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-muted/30"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
            <span className="text-sm">Laduje {title}…</span>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center justify-center gap-2 p-8 text-center" role="alert">
          <p className="font-medium text-foreground">Nie udalo sie zaladowac {title}</p>
          <p className="text-sm text-muted-foreground">
            Sprobuj odswiezyc strone. Jesli problem sie powtarza, otworz panel bezposrednio:
          </p>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Otworz w nowej karcie
          </a>
        </div>
      )}

      <iframe
        src={src}
        title={title}
        height={height}
        width="100%"
        loading="lazy"
        onLoad={() => setStatus("ready")}
        onError={() => setStatus("error")}
        style={{
          border: 0,
          display: status === "error" ? "none" : "block",
          opacity: status === "ready" ? 1 : 0,
          transition: "opacity 200ms ease",
        }}
      />
    </div>
  )
}
