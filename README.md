# Maczeta Life

Przeglądarkowa gra 3D w `three.js` z widokiem z pierwszej osoby, walką wręcz i lokalnym leaderboardem.

## Co jest w środku

- surowe miasto inspirowane Krakowem z prostszą, bardziej realistyczną zabudową
- walka bronią białą: maczeta, nóż, tasak, baton, łom, rura, saperka, kij
- przeciwniczki w stylizowanych tradycyjnych strojach i kominiarkach
- AI z zabawnymi polskimi imionami i komunikatami po polsku
- zapętlona muzyka z lokalnego pliku `mp3`
- opcjonalne kwestie głosowe z lokalnych plików w `assets/voice`
- tablica wyników zapisywana w `localStorage`

## Uruchomienie

Odpal dowolny prosty serwer statyczny w katalogu projektu, na przykład:

```bash
python3 -m http.server 8000
```

Potem otwórz `http://localhost:8000`.

## Głos ElevenLabs

Nie wkładaj klucza API do frontendu ani do plików projektu. Ten projekt ładuje tylko lokalne pliki audio z `assets/voice`.

Jeśli chcesz wygenerować kwestie z ElevenLabs, ustaw lokalnie:

```bash
export ELEVENLABS_API_KEY=twoj_klucz
export ELEVENLABS_VOICE_ID=twoj_voice_id
node ./tools/generate-elevenlabs-voice.mjs
```

Teksty klipów są w `tools/voice-lines.json`.

## Sterowanie

- `WASD`: ruch
- `Mysz`: rozglądanie po zablokowaniu kursora
- `Shift`: sprint
- `Spacja`: szybki cios
- `E`: mocny cios
- `LPM` / `PPM`: szybki i mocny atak
- `R`: restart po śmierci
