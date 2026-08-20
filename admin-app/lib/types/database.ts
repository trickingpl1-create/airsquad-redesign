// Jedyne źródło prawdy dla typów bazy żyje w aplikacji publicznej:
// airsquad-web/lib/types/database.ts. Panel i strona czytają tę samą bazę
// Supabase, więc rozjazd typów oznaczałby ciche błędy w CRUD-zie — dlatego
// tu tylko re-eksport, bez własnych definicji. Nowe pola dopisuj w oryginale.
export * from '../../../lib/types/database'
