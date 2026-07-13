# PromptOptim V5 — Guide API Frontend

> Base URL locale : `http://localhost:8000`
> Base URL production : `https://promptoptim-api.onrender.com` *(à mettre à jour)*

---

## Authentification

Toutes les routes protégées nécessitent un header :
```
Authorization: Bearer <access_token>
```

Le token est obtenu via `/auth/login` et expire après **1h**. Utiliser `/auth/refresh` pour le renouveler.

---

## Routes d'authentification

### POST `/auth/register`

Inscription d'un nouvel utilisateur. Supabase envoie automatiquement un **email de vérification**.

**Body :**
```json
{
  "email": "user@example.com",
  "password": "MonMotDePasse1!"
}
```

**Règles mot de passe :** min. 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial (`!@#$%^&*(),.?":{}|<>`)

**Réponse 201 :**
```json
{
  "message": "Registration successful. Please check your email to verify your account."
}
```

**Erreurs :**
| Code | Message | Cause |
|------|---------|-------|
| 400 | `"Email already registered"` | Email déjà utilisé |
| 422 | `"Password must be..."` | Validation du mot de passe échouée |

---

### POST `/auth/login`

Connexion. Retourne les tokens JWT.

> ⚠️ **Changement vs V4** : JSON uniquement (plus de `form-data`), champ `email` (plus `username`).

**Body :**
```json
{
  "email": "user@example.com",
  "password": "MonMotDePasse1!"
}
```

**Réponse 200 :**
```json
{
  "access_token": "eyJhbG...",
  "refresh_token": "xxxxx-xxxxx",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "uuid-xxxx",
    "email": "user@example.com"
  }
}
```

**Erreurs :**
| Code | Message | Cause |
|------|---------|-------|
| 401 | `"Invalid email or password"` | Identifiants incorrects |
| 403 | `"Email not verified"` | Email pas encore confirmé |

---

### POST `/auth/refresh`

Renouveler l'`access_token` avant expiration.

**Body :**
```json
{
  "refresh_token": "xxxxx-xxxxx"
}
```

**Réponse 200 :**
```json
{
  "access_token": "nouveau-token...",
  "refresh_token": "nouveau-refresh...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

---

### POST `/auth/logout`

🔒 *Auth requise.*

Invalide la session côté Supabase.

**Réponse 200 :**
```json
{ "message": "Logged out successfully" }
```

---

### POST `/auth/forgot-password`

Envoie un email de réinitialisation. Toujours `200` (anti-énumération).

**Body :**
```json
{ "email": "user@example.com" }
```

**Réponse 200 :**
```json
{ "message": "If this email is registered, you will receive a reset link." }
```

---

### POST `/auth/reset-password`

Réinitialiser le mot de passe avec les tokens issus de la redirection Supabase.

> **Flow côté frontend :** Supabase redirige vers `{FRONTEND_URL}/reset-password#access_token=...&refresh_token=...`. Le frontend extrait ces tokens du hash de l'URL et les envoie ici.

**Body :**
```json
{
  "access_token": "token-from-url-fragment",
  "refresh_token": "refresh-from-url-fragment",
  "new_password": "NouveauPass1!"
}
```

**Réponse 200 :**
```json
{ "message": "Password updated successfully" }
```

---

### GET `/auth/me`

🔒 *Auth requise.*

Informations de l'utilisateur connecté.

**Réponse 200 :**
```json
{
  "id": "uuid-xxxx",
  "email": "user@example.com",
  "created_at": "2026-03-20T14:30:00Z"
}
```

---

### DELETE `/auth/me`

🔒 *Auth requise.*

Supprime le compte (et toutes les données en cascade).

**Réponse 204 :** *(No Content)*

---

## Routes principales

### POST `/api/generate`

🔒 *Auth requise. Limité à 20 req/min.*

Route principale. Pipeline complet : anonymisation PII → optimisation Mistral → calcul Green IT & souveraineté → sauvegarde historique.

**Body :**
```json
{
  "input_text": "Ecris-moi un email pour demander une augmentation",
  "target_model": "mistral_2"
}
```

**Valeurs `target_model` :**
| Valeur | Modèle |
|--------|--------|
| `"mistral_2"` | Mistral Large 2 *(défaut)* |
| `"gpt_5"` | GPT-5 |
| `"claude_opus"` | Claude Opus |
| `"gemini_3_pro"` | Gemini 3 Pro |
| `"midjourney_v6"` | Midjourney V6 |

**Réponse 200 :**
```json
{
  "original_intent": "Ecris-moi un email pour demander une augmentation",
  "optimized_prompt": "Redige un email formel et concis pour négocier une revalorisation salariale...",
  "target_model": "mistral_2",
  "green_data": {
    "tokens_saved": 42,
    "energy_saved_kwh": 0.000084,
    "co2_saved_g": 0.0042,
    "water_saved_ml": 0.04,
    "eco_score": "C",
    "equivalences": {
      "smartphone_charges": 0.0012,
      "km_electric_car": 0.00004,
      "hours_led_bulb": 0.0042
    },
    "methodology_source": "Methodology based on ADEME 2024 factors & Cloud Carbon Footprint standards.",
    "timestamp_factor": 1.0
  },
  "sovereignty_data": {
    "score": 100,
    "location": "France (UE)",
    "company": "Mistral AI (Francaise)",
    "license": "Open Weights / Apache",
    "cloud_act_risk": false
  },
  "ai_reasoning": "J'ai restructuré le prompt en supprimant les formulations vagues..."
}
```

---

### GET `/api/history`

🔒 *Auth requise.*

Historique des prompts de l'utilisateur, du plus récent au plus ancien.

**Query params :**
| Param | Type | Défaut | Description |
|-------|------|--------|-------------|
| `skip` | int | `0` | Offset pour pagination |
| `limit` | int | `100` | Nombre max de résultats (max 500) |

**Exemple :** `GET /api/history?skip=0&limit=20`

**Réponse 200 :** *liste de prompts* (même structure que `/api/generate` + champs `id` et `created_at`)

```json
[
  {
    "id": 42,
    "original_intent": "...",
    "optimized_prompt": "...",
    "target_model": "mistral_2",
    "green_data": { "..." },
    "sovereignty_data": { "..." },
    "ai_reasoning": "...",
    "created_at": "2026-03-20T14:30:00Z"
  }
]
```

---

### GET `/api/stats`

🔒 *Auth requise.*

Statistiques agrégées de l'utilisateur.

**Réponse 200 :**
```json
{
  "total_prompts": 15,
  "total_tokens_saved": 847,
  "total_co2_saved": 1.2345,
  "model_usage": {
    "mistral_2": 8,
    "gpt_5": 4,
    "claude_opus": 3
  }
}
```

---

## Comparateur de modèles

### GET `/api/models`

🌐 *Public — pas d'auth requise.*

Liste tous les modèles IA supportés avec leurs données de souveraineté et d'impact écologique.

**Réponse 200 :**
```json
[
  {
    "id": "mistral_2",
    "name": "Mistral Large 2",
    "provider": "Mistral AI",
    "sovereignty": {
      "score": 100,
      "location": "France (UE)",
      "company": "Mistral AI (Francaise)",
      "license": "Open Weights / Apache",
      "cloud_act_risk": false,
      "rgpd_compliant": true
    },
    "green": {
      "energy_per_1k_tokens_kwh": 0.002,
      "carbon_intensity_gco2_kwh": 50,
      "water_intensity_ml_kwh": 500,
      "datacenter_location": "France"
    }
  }
]
```

---

## Bibliothèque de templates

### GET `/api/templates`

🔒 *Auth requise.*

Récupère les templates de l'utilisateur + les templates publics.

**Query params :**
| Param | Type | Défaut | Description |
|-------|------|--------|-------------|
| `category` | string | `null` | Filtrer par catégorie |
| `mine_only` | bool | `false` | Afficher uniquement ses templates |
| `skip` | int | `0` | Offset |
| `limit` | int | `50` | Limite (max 200) |

**Réponse 200 :**
```json
[
  {
    "id": 1,
    "title": "Email professionnel",
    "description": "Template pour rédiger des emails formels",
    "template_text": "Rédige un email professionnel pour {sujet}...",
    "target_model": "mistral_2",
    "category": "business",
    "is_public": true,
    "is_mine": false,
    "usage_count": 42,
    "created_at": "2026-03-15T10:00:00Z"
  }
]
```

---

### POST `/api/templates`

🔒 *Auth requise.*

Créer un nouveau template.

**Body :**
```json
{
  "title": "Mon template",
  "description": "Description optionnelle",
  "template_text": "Le texte avec {variables}...",
  "target_model": "mistral_2",
  "category": "business",
  "is_public": false
}
```

**Réponse 201 :** *(même structure que GET, avec `is_mine: true`)*

---

### DELETE `/api/templates/{id}`

🔒 *Auth requise.*

Supprimer un de ses propres templates.

**Réponse 204 :** *(No Content)*
**Réponse 404 :** si le template n'existe pas ou ne lui appartient pas.

---

## Santé du serveur

### GET `/health`

🌐 *Public.*

```json
{ "status": "ok", "project": "PromptOptim", "version": "5.0.0" }
```

---

## Gestion des erreurs

Toutes les erreurs suivent ce format :
```json
{ "detail": "Message d'erreur lisible" }
```

| Code | Signification |
|------|--------------|
| 400 | Requête invalide (ex: email déjà existant) |
| 401 | Non authentifié / token invalide |
| 403 | Email non vérifié |
| 404 | Ressource introuvable |
| 422 | Erreur de validation (body mal formé) |
| 429 | Trop de requêtes (rate limit) |
| 502/503 | Erreur serveur externe (Supabase, Mistral) |

---

## Récap des changements V4 → V5

| V4 | V5 | Impact |
|----|-----|--------|
| `POST /register` | `POST /auth/register` | Prefix `/auth` ajouté |
| `POST /token` (form-data, `username`) | `POST /auth/login` (JSON, `email`) | **Changement majeur** |
| `POST /refresh` | `POST /auth/refresh` | Prefix `/auth` |
| `POST /forgot-password` | `POST /auth/forgot-password` | Prefix `/auth` |
| `POST /reset-password` | `POST /auth/reset-password` | Body change : envoyer `access_token` + `refresh_token` du fragment URL |
| `DELETE /users/me` | `DELETE /auth/me` | Prefix `/auth` |
| `POST /api/generate` | Identique ✅ | — |
| `GET /api/history` | Identique ✅ | — |
| `GET /api/stats` | Identique ✅ | — |
| *(nouveau)* | `GET /api/models` | Comparateur IA public |
| *(nouveau)* | `GET/POST/DELETE /api/templates` | Bibliothèque templates |

---

## Exemple d'intégration JS (fetch)

```js
// Login
const res = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { access_token, refresh_token } = await res.json();

// Appel authentifié
const gen = await fetch('/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  },
  body: JSON.stringify({ input_text: "Mon intention", target_model: "mistral_2" })
});
const result = await gen.json();
// result.optimized_prompt, result.green_data, result.sovereignty_data
```

---

*Documentation générée pour PromptOptim V5 — PFE ECE Paris 2026*
