# BerniNutri AI

BerniNutri AI is a mobile-first nutrition tracker demo that turns a meal photo into an estimated nutrition log. The app lets users upload or sample a meal image, send it to an AI-backed analysis endpoint, review the result, save it locally, and track calories and macros through a compact app-style interface.

Live demo: https://berninutri-portfolio.vercel.app

## What It Does

- Provides a mobile app experience with login, bottom navigation, swipe-friendly routes, and standalone PWA metadata.
- Uploads meal photos, compresses them in the browser, and sends them to `/api/analyze`.
- Uses an OpenAI-backed Vercel endpoint with a strict JSON schema for meal name, calories, macros, ingredients, confidence, and notes.
- Normalizes AI responses before they reach the UI, so the app can display consistent nutrition cards.
- Saves meals in local browser storage and keeps sample meals available for a useful empty state.
- Includes Today, Add Meal, Result, History, Stats, and Profile screens.
- Handles missing API configuration and analysis errors with clear user-facing messages.

## Why This Project Matters

This project shows the full shape of an AI product, not only a prompt. The frontend handles image preparation, navigation, review, saved history, and progress views, while the backend keeps the OpenAI key server-side and validates the response before the UI trusts it.

The app is intentionally built as a portfolio-ready product slice: small enough to understand quickly, but complete enough to show product thinking, API integration, error handling, and polished mobile UI work.

## Tech Stack

- React 19 and TypeScript
- Vite
- Vercel serverless functions
- OpenAI Responses API for image analysis
- Browser localStorage for saved meal history
- lucide-react icons
- PWA manifest metadata

## Running Locally

```bash
npm install
npm run dev
```

Build the app:

```bash
npm run build
```

## AI Setup

Set an OpenAI API key in local or Vercel environment variables:

```bash
OPENAI_API_KEY=sk-...
```

Optionally override the model:

```bash
OPENAI_MODEL=gpt-4.1-mini
```

Without `OPENAI_API_KEY`, the interface still runs, but `/api/analyze` returns a configuration message instead of an analysis.

## Current Status

BerniNutri AI is a functional portfolio demo. The main user journey is complete: choose a meal image, analyze it, review nutrition estimates, save the meal, and browse daily history and stats. The next useful steps would be user accounts, a real database, editable meals, and longer-term nutrition trends.

AI nutrition estimates are approximate and should not be treated as medical or dietary advice.
