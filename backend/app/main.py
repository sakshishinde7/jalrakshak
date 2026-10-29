"""JALRAKSHAK — FastAPI application entry point."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routes import router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle handler."""
    # --- Startup ---
    try:
        logger.info("Creating database tables if they do not exist…")
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables verified.")
    except Exception as exc:
        logger.warning(
            "Database table creation deferred (database may still be starting): %s", exc
        )
    logger.info(
        "JALRAKSHAK API server is running on port %s", settings.PORT
    )
    yield
    # --- Shutdown ---
    logger.info("JALRAKSHAK API server is shutting down.")


app = FastAPI(
    title="JALRAKSHAK API",
    description="Community platform for reporting water-related problems.",
    version="1.0.0",
    lifespan=lifespan,
)

# ---- Cross-Platform CORS ----
origins = settings.cors_origins
if "*" in origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["GET", "POST", "OPTIONS", "HEAD"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_origin_regex=r"https://.*(\.vercel\.app|\.onrender\.com|\.netlify\.app|\.railway\.app)",
        allow_credentials=False,
        allow_methods=["GET", "POST", "OPTIONS", "HEAD"],
        allow_headers=["*"],
    )

# ---- Routes ----
app.include_router(router)
