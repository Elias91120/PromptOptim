# PromptOptim — 3Geeks

Monorepo PromptOptim V6 (FastAPI + Next.js 16).

- **Web** : `web/` — Next.js 16 App Router TypeScript (standalone Docker :3000)
- **Backend** : `backend/` — FastAPI, JWT, PostgreSQL, api.3geeks.fr
- **Legacy** : `frontend/` — ancienne SPA Vite (remplacée par `web/`)

## Production

- https://prompt-optim.3geeks.fr

## Compte test (seed auto au démarrage)

- Email : `test@3geeks.fr`
- Mot de passe : `PromptOptim!2026`

## Modèles IA (2026)

8 modèles cibles via `GET /api/models` : Mistral Large 3, Codestral 2, Claude Sonnet/Opus 4, GPT-4.1, o4-mini, Gemini 2.5 Pro, Flux 1.1.

Registry unique : `backend/app/data/models_registry.py`

## Dev local

```bash
# Backend
cd backend
cp .env.example .env
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Web (proxifie /api /auth vers backend via rewrites)
cd web
npm ci
npm run dev
```

## Docker prod

- `web/Dockerfile` → Next.js standalone port 3000
- `backend/Dockerfile` → FastAPI port 8000
- Env web : `INTERNAL_API_URL=http://prompt-optim-api:8000`
