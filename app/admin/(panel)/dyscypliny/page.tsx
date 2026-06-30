import Link from 'next/link'

export default function DisciplinesAdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dyscypliny</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Zarządzaj obrazkami i opisami dyscyplin. Zmiany są natychmiastowe.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-8">
        <h2 className="text-xl font-semibold text-foreground">Edycja obrazków</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Aby zmienić obrazek dla dyscypliny, edytuj pole `photo` w pliku:
        </p>
        <code className="mt-4 block rounded bg-secondary p-4 font-mono text-sm text-foreground">
          components/home/disciplines-section.tsx
        </code>

        <div className="mt-6 space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Kroki:</h3>
            <ol className="mt-2 list-inside list-decimal space-y-2 text-sm text-muted-foreground">
              <li>Otwórz plik <code className="rounded bg-secondary px-2 py-1 font-mono">disciplines-section.tsx</code></li>
              <li>Znajdź dyscyplinę którą chcesz zmienić (np. "akrobatyka")</li>
              <li>Zmień wartość w polu <code className="rounded bg-secondary px-2 py-1 font-mono">photo: "..."</code></li>
              <li>Wklej URL nowego obrazka (min. 600x400px)</li>
              <li>Zapisz plik — strona się zaaktualizuje automatycznie</li>
            </ol>
          </div>

          <div className="mt-6 rounded-lg bg-blue-500/10 p-4">
            <p className="text-sm text-blue-600">
              <strong>💡 Tip:</strong> Możesz użyć URL'ów z:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-blue-600">
              <li>Unsplash: <code className="rounded bg-secondary px-2 py-0.5 font-mono text-xs">https://images.unsplash.com/...</code></li>
              <li>Własnego hostingu lub Vercel Blob</li>
              <li>Lokalnych plików: <code className="rounded bg-secondary px-2 py-0.5 font-mono text-xs">/images/dyscypliny/akrobatyka.jpg</code></li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/components/home/disciplines-section.tsx"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Otwórz plik do edycji
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-8">
        <h2 className="text-xl font-semibold text-foreground">Obecne obrazki</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Oto aktualne URL'e dla każdej dyscypliny:
        </p>

        <div className="mt-6 space-y-4">
          {[
            { name: 'Akrobatyka', field: 'photo' },
            { name: 'Tricking', field: 'photo' },
            { name: 'Longboard', field: 'photo' },
            { name: 'Tumbling', field: 'photo' },
            { name: 'Showdance', field: 'photo' },
            { name: 'Snowboard', field: 'photo' },
          ].map((d) => (
            <div key={d.name} className="rounded border border-border p-4">
              <p className="font-semibold text-foreground">{d.name}</p>
              <p className="mt-2 break-all text-xs text-muted-foreground">
                Edytuj pole <code className="rounded bg-secondary px-1 font-mono">photo</code> w sekcji <code className="rounded bg-secondary px-1 font-mono">{d.name}</code>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
