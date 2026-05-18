# BerniNutri

BerniNutri is a mobile-first AI nutrition tracker prototype. It lets a user upload a meal photo, send it to an OpenAI-backed analysis endpoint, review estimated calories/macros and save the result in local browser history.

PL: BerniNutri to prototyp aplikacji AI do pomocniczej analizy posiłków ze zdjęcia. Wyniki są estymacją, nie poradą medyczną ani dietetyczną.

## Live demo

https://berninutri-portfolio.vercel.app

## Screenshots

Screenshots should be added to `docs/screenshots/`. Placeholder image links are intentionally not included.

## Features

- Mobile-first React UI with app-like routes.
- Meal photo upload and browser-side image compression.
- `/api/analyze` serverless endpoint that keeps `OPENAI_API_KEY` server-side.
- OpenAI Responses API call with strict JSON schema.
- Nutrition result review with calories, macros, ingredients, confidence and notes.
- Local meal history stored in browser localStorage.
- Missing API key and analysis error states.
- Sample meals so the UI has a useful empty state.

## AI role and limitations

The AI feature estimates visible food from a photo. Results can be incomplete or inaccurate. BerniNutri is not medical advice, dietary advice or a professional nutrition service. Users should treat the result as a helper, not a source of truth.

## Tech stack

- React
- TypeScript
- Vite
- Vercel serverless functions
- OpenAI Responses API
- Browser localStorage
- lucide-react

## Project structure

- `src/main.tsx` — app shell, screens and UI flow.
- `src/meal-utils.ts` — testable meal conversion and macro helper logic.
- `src/styles.css` — mobile-first app styling.
- `api/analyze.js` — Vercel endpoint for OpenAI image analysis.
- `public/` — PWA manifest.
- `docs/` — roadmap, changelog, issue backlog and screenshots folder.

## Getting started

```bash
git clone https://github.com/ft4k696bk6-prog/berninutri-portfolio.git
cd berninutri-portfolio
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Environment variables

Create `.env.local` from `.env.example`.

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

Without `OPENAI_API_KEY`, the UI still runs, but `/api/analyze` returns a configuration message instead of an analysis.

## What I learned

- Building a product flow around an AI feature instead of only a prompt.
- Keeping API keys server-side in a Vercel function.
- Normalizing structured model output before displaying it in the UI.
- Handling localStorage-backed history and empty states.
- Communicating AI uncertainty clearly in the interface and docs.

## Roadmap

- Improve image and input validation.
- Add editable meal results before saving.
- Add account-based history with a real database.
- Add stronger API error handling and retry copy.
- Add more tests for analysis response handling.
- Improve accessibility and keyboard navigation.

## Status

Prototype.

## License

MIT.
