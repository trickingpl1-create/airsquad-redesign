# Zdjęcia grupowe kadry

Wrzuć tu cztery pliki pod DOKŁADNIE tymi nazwami:

| plik | co przedstawia |
|---|---|
| `kadra-air-meeting-2025.jpg` | jasnoniebieskie koszulki „Air Meeting", hala, baner AIR SQUAD |
| `kadra-air-camp-piramida.jpg` | pomarańczowe koszulki, las, piramida akrobatyczna |
| `kadra-air-camp-2025.jpg` | jasnoniebieskie koszulki „Air Camp", las i piasek |
| `kadra-podsumowanie-sezonu.jpg` | czarne koszulki, dyplomy, hala AirSpace |

Zasady:
- `chmod 644` na plikach — inaczej Apache na hostingu zwraca 403
  (lftp zachowuje uprawnienia; zdarzyło się to już wcześniej)
- lista w `lib/content/team-photos.ts` filtruje po istnieniu pliku w czasie
  builda, więc brakujące zdjęcie nie psuje strony — po prostu się nie pokazuje
