// Filmy klubu na /media/. Wcześniej ten komponent osadzał dwa razy ten sam
// placeholderowy film (dQw4w9WgXcQ — rickroll) pod tytułem „Air Squad Video"
// i importował klienta Supabase, którego w ogóle nie używał.
//
// Filmy to te same materiały, które już żyją w treści strony:
// LETNI_EVENT.youtubeId (/letni/, sekcja obozu na stronie głównej) oraz hero
// podstron miast (lib/content/cities.ts → hero_youtube_id). Nowe pozycje
// dopisuj tutaj — /media/ nie czyta filmów z bazy.
const VIDEOS = [
  { id: '-P1J3YntBpY', title: 'Air Camp — zajawka obozu' },
  { id: 'cVqSuMi2WEc', title: 'Akrobatyka Jasło — trening' },
  { id: 'KPxvLDfjE7g', title: 'Akrobatyka Dębica — trening' },
] as const

export function YouTubeSection() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {VIDEOS.map((video) => (
        <div key={video.id} className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0&modestbranding=1`}
            title={video.title}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg border-0"
          />
        </div>
      ))}
    </div>
  )
}
