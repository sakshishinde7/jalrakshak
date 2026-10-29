"""Pydantic v2 request / response schemas."""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class IssueCategory(str, Enum):
    WATER_POLLUTION = "Water Pollution"
    SEWAGE_CONTAMINATION = "Sewage Contamination"
    PLASTIC_WASTE = "Plastic Waste"
    WATER_LEAKAGE = "Water Leakage or Wastage"
    OTHER = "Other"


class ReportStatus(str, Enum):
    PENDING = "Pending"
    UNDER_INVESTIGATION = "Under Investigation"
    RESOLVED = "Resolved"


# ---------------------------------------------------------------------------
# Request schemas
# ---------------------------------------------------------------------------

class ReportCreate(BaseModel):
    """Payload accepted by POST /api/reports."""

    reporter_name: str = Field(..., min_length=1, max_length=100)
    reporter_email: Optional[str] = Field(None, max_length=200)
    location_name: str = Field(..., min_length=1, max_length=300)
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    issue_category: IssueCategory
    description: str = Field(..., min_length=1, max_length=2000)

    @field_validator("reporter_email")
    @classmethod
    def validate_email(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v == "":
            return None
        # Simple validation: must contain '@' and a '.'
        if "@" not in v or "." not in v.split("@")[-1]:
            raise ValueError("Invalid email address")
        return v

    @field_validator("reporter_name", "location_name", "description")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return v.strip()


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------

class ReportPublic(BaseModel):
    """Public representation of a report (no reporter_email)."""

    id: int
    report_code: str
    reporter_name: str
    location_name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    issue_category: str
    description: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ReportListResponse(BaseModel):
    """Paginated list response."""

    reports: list[ReportPublic]
    total: int
    page: int
    pages: int


class StatsResponse(BaseModel):
    """Dashboard statistics."""

    total: int
    pending: int
    under_investigation: int
    resolved: int
    by_category: dict[str, int]


class HealthResponse(BaseModel):
    status: str
    database: str


class RootResponse(BaseModel):
    message: str
    version: str
