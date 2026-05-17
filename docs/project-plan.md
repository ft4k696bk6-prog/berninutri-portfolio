# Project Plan: BerniNutri AI

## English

### Project Goal

I built a mobile-first nutrition tracker demo that turns a meal photo into an estimated nutrition log. I wanted to show a complete AI project slice: image input, backend analysis, structured response validation, review flow, saved history, and a polished app-like interface.

### Problem and Users

I designed this for someone who wants to quickly estimate calories and macros without manually entering every ingredient. My goal was to show that the project is more than a prompt wrapper: it includes frontend preparation, API design, response normalization, failure handling, and user experience around uncertain AI output.

### Functional Scope

I planned the project scope around:

- Mobile app-style navigation with login, bottom tabs, and PWA metadata.
- Meal image upload and browser-side image preparation.
- Serverless `/api/analyze` endpoint that keeps the OpenAI key on the server.
- AI analysis returning structured nutrition data: meal name, calories, macros, ingredients, confidence, and notes.
- Response normalization before data reaches the UI.
- Result review screen before saving.
- Local meal history stored in browser storage.
- Today, Add Meal, Result, History, Stats, and Profile screens.
- Sample meals and useful empty states.
- Clear messages for missing API configuration and analysis errors.

### Architecture and Technical Decisions

- I chose React, TypeScript, and Vite for a fast single-page portfolio app.
- I chose a Vercel serverless function for AI analysis so secrets never ship to the browser.
- I used a strict JSON response contract so the UI receives predictable nutrition data.
- I normalized AI output at the API boundary to reduce UI branching and unsafe assumptions.
- I used localStorage for the portfolio version to keep the demo self-contained without account or database setup.
- I kept the interface mobile-first because meal logging is naturally a phone workflow.
- I allowed the UI to run without `OPENAI_API_KEY`, while the endpoint returns a clear configuration message.

### Delivery Phases

1. Project shell: Vite app, mobile layout, routes/screens, bottom navigation, and app metadata.
2. Meal input: image upload, sample images, preview state, and browser-side preparation.
3. AI backend: `/api/analyze`, OpenAI integration, JSON schema expectations, and environment handling.
4. Result flow: normalized response display, confidence, ingredients, notes, and save action.
5. Persistence and history: local meal storage, daily summary, history, and stats views.
6. Polish and resilience: loading states, errors, empty states, profile screen, and deployment docs.

### What Has Been Delivered

In the repository I delivered a functional portfolio demo with the main user journey in place: choose or upload a meal image, analyze it through an AI-backed endpoint, review estimated nutrition data, save the meal locally, and browse history and stats. The README and commit history show work on the initial app, portfolio demo, fullscreen mobile experience, and documentation polish.

### Acceptance Criteria

- User can add a meal image or use a sample image.
- The app sends analysis requests through `/api/analyze`, not directly from the browser to OpenAI.
- The endpoint handles missing configuration with a clear response.
- Successful analysis produces stable fields for meal name, calories, protein, carbs, fat, ingredients, confidence, and notes.
- User can review the result before saving.
- Saved meals persist locally across page reloads.
- Today, History, Stats, and Profile screens remain usable on mobile-sized screens.

### Testing and Verification

- Run `npm run build` to verify TypeScript and production bundling.
- Manually test the app with and without `OPENAI_API_KEY`.
- Test image upload, sample meal selection, loading state, successful result, failed analysis, and save flow.
- Reload the browser and confirm saved meals remain in local history.
- Verify the Vercel deployment serves both the frontend and `/api/analyze` endpoint.

### What This Project Shows

This project shows practical AI project thinking: secure API boundaries, schema-like response handling, uncertainty-aware UI, local persistence, mobile UX, and graceful failure states. It shows that I can turn an AI capability into a usable workflow rather than only calling a model.

### Future Improvements

- Add user accounts and cloud meal history.
- Add editable meal entries after AI analysis.
- Add longer-term nutrition trends and weekly summaries.
- Add barcode/manual entry as alternatives to photo analysis.
- Add stronger nutrition disclaimers and source confidence indicators.

---

## Polski

### Cel projektu

Zbudowałem mobilny tracker żywienia, który zamienia zdjęcie posiłku w szacowany wpis z kaloriami i makroskładnikami. Chciałem pokazać kompletnego wycinka projektu AI: wejście obrazem, analiza po stronie backendu, walidacja odpowiedzi, ekran przeglądu, historia zapisów i dopracowany interfejs przypominający aplikację mobilną.

### Problem i użytkownicy

Zaprojektowałem to dla osoby, która chce szybko oszacować kalorie i makro bez ręcznego wpisywania każdego składnika. Chciałem też pokazać, że to nie jest sama „nakładka na prompt”, tylko pełny przepływ: przygotowanie obrazu, API, normalizacja odpowiedzi, obsługa błędów i UX wokół niepewnego wyniku AI.

### Zakres funkcjonalny

Zakres projektu rozpisałem na:

- Mobilną nawigację z ekranem logowania, dolnym menu i metadanymi PWA.
- Upload zdjęcia posiłku i przygotowanie obrazu w przeglądarce.
- Endpoint serverless `/api/analyze`, który trzyma klucz OpenAI po stronie serwera.
- Analizę AI zwracającą uporządkowane dane: nazwę posiłku, kalorie, makro, składniki, confidence i notatki.
- Normalizację odpowiedzi zanim trafi ona do UI.
- Ekran przeglądu wyniku przed zapisem.
- Lokalną historię posiłków w przeglądarce.
- Widoki Today, Add Meal, Result, History, Stats i Profile.
- Przykładowe posiłki i sensowne empty states.
- Czytelne komunikaty przy braku konfiguracji API i błędach analizy.

### Architektura i decyzje techniczne

- React, TypeScript i Vite jako szybka baza aplikacji portfolio.
- Funkcja serverless Vercel do analizy AI, żeby sekrety nie trafiały do przeglądarki.
- Ścisły kontrakt odpowiedzi JSON, aby UI dostawał przewidywalne dane żywieniowe.
- Normalizacja odpowiedzi na granicy API, żeby ograniczyć warunki i ryzykowne założenia w UI.
- localStorage w wersji portfolio, żeby demo było samowystarczalne bez kont i bazy danych.
- Mobile-first, bo logowanie posiłków jest naturalnie procesem telefonowym.
- Możliwość uruchomienia UI bez `OPENAI_API_KEY`, z jasnym komunikatem konfiguracji z endpointu.

### Etapy realizacji

1. Szkielet projektu: aplikacja Vite, mobilny layout, ekrany, dolna nawigacja i metadane.
2. Wejście posiłku: upload zdjęcia, przykłady, podgląd i przygotowanie obrazu.
3. Backend AI: `/api/analyze`, integracja OpenAI, oczekiwany JSON i obsługa środowiska.
4. Wynik analizy: prezentacja znormalizowanej odpowiedzi, confidence, składniki, notatki i zapis.
5. Persistencja i historia: localStorage, podsumowanie dnia, historia i statystyki.
6. Dopracowanie: loadingi, błędy, empty states, profil i dokumentacja deploymentu.

### Co zostało zrobione

W repozytorium dowiozłem działające demo portfolio z głównym przepływem użytkownika: wybór lub upload zdjęcia posiłku, analiza przez endpoint AI, przegląd szacowanych danych żywieniowych, zapis lokalny oraz historia i statystyki. README i historia commitów pokazują stworzenie aplikacji, demo portfolio, fullscreen mobile experience i dopracowanie dokumentacji.

### Kryteria akceptacji

- Użytkownik może dodać zdjęcie posiłku albo użyć przykładu.
- Aplikacja wysyła analizę przez `/api/analyze`, nie bezpośrednio z przeglądarki do OpenAI.
- Endpoint obsługuje brak konfiguracji jasnym komunikatem.
- Poprawna analiza zwraca stabilne pola: nazwa, kalorie, białko, węgle, tłuszcz, składniki, confidence i notatki.
- Użytkownik widzi wynik przed zapisem.
- Zapisane posiłki zostają w lokalnej historii po odświeżeniu strony.
- Widoki Today, History, Stats i Profile są używalne na ekranie mobilnym.

### Testowanie i weryfikacja

- Uruchomić `npm run build`, żeby sprawdzić TypeScript i bundling produkcyjny.
- Ręcznie przetestować aplikację z `OPENAI_API_KEY` i bez niego.
- Sprawdzić upload zdjęcia, wybór przykładu, loading, poprawny wynik, błąd analizy i zapis.
- Odświeżyć stronę i potwierdzić, że zapisane posiłki zostają w historii.
- Sprawdzić, czy deployment Vercel obsługuje frontend i endpoint `/api/analyze`.

### Co pokazuje ten projekt

Tym projektem pokazuję praktyczne myślenie o projekcie AI: bezpieczną granicę API, uporządkowaną odpowiedź modelu, UI świadomy niepewności wyniku, lokalną persistencję, mobile UX i obsługę błędów. Tym pokazuję zamianę możliwości modelu w użyteczny workflow, a nie tylko wywołania API.

### Możliwe dalsze kroki

- Dodać konta użytkowników i historię w chmurze.
- Dodać edycję posiłku po analizie AI.
- Dodać długoterminowe trendy i tygodniowe podsumowania.
- Dodać kod kreskowy lub ręczne dodawanie jako alternatywę dla zdjęcia.
- Rozbudować disclaimery żywieniowe i wskaźniki pewności danych.
