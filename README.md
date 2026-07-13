# PromptOptim — 3Geeks

Monorepo PromptOptim V5 (FastAPI + React/Vite).

- **Frontend** : `frontend/` — SPA nginx, proxifié vers l'API
- **Backend** : `backend/` — FastAPI, JWT, PostgreSQL, api.3geeks.fr

## Production

- https://prompt-optim.3geeks.fr

## Compte test (seed auto au démarrage)

- Email : `test@3geeks.fr`
- Mot de passe : `PromptOptim!2026`

## Dev local

```bash
# Backend
cd backend
cp .env.example .env
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm ci
npm run dev
```
