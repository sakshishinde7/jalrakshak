"""SQLAlchemy ORM models for the JALRAKSHAK platform."""

from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class WaterReport(Base):
    """A single water-related problem report submitted by a community member."""

    __tablename__ = "water_reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    report_code: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    reporter_name: Mapped[str] = mapped_column(String(100), nullable=False)
    reporter_email: Mapped[str | None] = mapped_column(String(200), nullable=True)
    location_name: Mapped[str] = mapped_column(String(300), nullable=False)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    issue_category: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="Pending")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    __table_args__ = (
        Index("ix_water_reports_status", "status"),
        Index("ix_water_reports_issue_category", "issue_category"),
        Index("ix_water_reports_created_at", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<WaterReport {self.report_code}>"
