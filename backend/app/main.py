from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.config import settings
from app.db.session import init_db
from app.limiter import limiter
from app.routers import auth, models, prompts, templates
from app.utils.error_handlers import register_error_handlers
from scripts.seed import run_seed


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    await run_seed()
    yield


app = FastAPI(
    title="PromptOptim API",
    description="L'Architecte de Prompts Eco-efficient & Souverain",
    version="5.0.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list + [settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RateLimitExceeded)
async def rate_limit_exceeded_handler(request, exc):
    return JSONResponse(status_code=429, content={"detail": "Rate limit exceeded. Please slow down."})


register_error_handlers(app)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(prompts.router, prefix="/api", tags=["Prompts"])
app.include_router(models.router, prefix="/api", tags=["Models"])
app.include_router(templates.router, prefix="/api", tags=["Templates"])


@app.get("/health")
async def health_check():
    return {"status": "ok", "project": "PromptOptim", "version": "5.0.0"}
