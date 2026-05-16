# BerniNutri AI

Functional portfolio build of a nutrition tracking mobile web app.

The app lets users upload a meal photo, send it to an AI analysis endpoint, review estimated macros, save the meal locally, browse history, check stats, and view profile goals.

## AI setup

Create an OpenAI API key and add it to your local or Vercel environment:

```bash
OPENAI_API_KEY=sk-...
```

Optional:

```bash
OPENAI_MODEL=gpt-4.1-mini
```

Without `OPENAI_API_KEY`, the UI stays usable but `/api/analyze` returns a configuration message instead of a fake analysis.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
