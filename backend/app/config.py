"""Application configuration loaded from environment variables."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Settings sourced from environment variables or a .env file."""

    # Defaults to local SQLite if DATABASE_URL is not set by cloud provider
    DATABASE_URL: str = "sqlite:///./jalrakshak.db"
    FRONTEND_ORIGIN: str = "http://localhost:5173"
    PORT: int = 8000

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }

    @property
    def database_url_sync(self) -> str:
        """Return a SQLAlchemy-compatible connection string.

        Render and other cloud providers normalize PostgreSQL scheme to
        ``postgres://`` which SQLAlchemy 2.x requires as ``postgresql+psycopg2://``.
        """
        url = self.DATABASE_URL
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+psycopg2://", 1)
        elif url.startswith("postgresql://") and "+psycopg2" not in url:
            url = url.replace("postgresql://", "postgresql+psycopg2://", 1)
        return url

    @property
    def cors_origins(self) -> list[str]:
        """Parse the comma-separated FRONTEND_ORIGIN into a list."""
        if not self.FRONTEND_ORIGIN:
            return ["http://localhost:5173"]
        return [origin.strip() for origin in self.FRONTEND_ORIGIN.split(",") if origin.strip()]


settings = Settings()
