"""API route handlers for the JALRAKSHAK platform."""

import math

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import WaterReport
from app.schemas import (
    HealthResponse,
    IssueCategory,
    ReportCreate,
    ReportListResponse,
    ReportPublic,
    ReportStatus,
    RootResponse,
    StatsResponse,
)
from app.utils import generate_report_code

router = APIRouter()

# ---------------------------------------------------------------------------
# Root
# ---------------------------------------------------------------------------

@router.get("/", response_model=RootResponse)
def root():
    """Landing endpoint."""
    return {"message": "JALRAKSHAK API", "version": "1.0.0"}


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

@router.get("/api/health", response_model=HealthResponse)
def health_check(db: Session = Depends(get_db)):
    """Return service health including a database connectivity check."""
    try:
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except SQLAlchemyError:
        raise HTTPException(status_code=503, detail={"status": "unhealthy", "database": "disconnected"})


# ---------------------------------------------------------------------------
# Stats
# ---------------------------------------------------------------------------

@router.get("/api/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    """Aggregate statistics across all reports."""
    try:
        total = db.query(func.count(WaterReport.id)).scalar() or 0

        # Status counts
        status_rows = (
            db.query(WaterReport.status, func.count(WaterReport.id))
            .group_by(WaterReport.status)
            .all()
        )
        status_map = {row[0]: row[1] for row in status_rows}

        # Category counts
        category_rows = (
            db.query(WaterReport.issue_category, func.count(WaterReport.id))
            .group_by(WaterReport.issue_category)
            .all()
        )
        category_map = {row[0]: row[1] for row in category_rows}

        # Ensure every known category is present
        by_category = {cat.value: category_map.get(cat.value, 0) for cat in IssueCategory}

        return StatsResponse(
            total=total,
            pending=status_map.get(ReportStatus.PENDING.value, 0),
            under_investigation=status_map.get(ReportStatus.UNDER_INVESTIGATION.value, 0),
            resolved=status_map.get(ReportStatus.RESOLVED.value, 0),
            by_category=by_category,
        )
    except SQLAlchemyError:
        raise HTTPException(status_code=503, detail="Database unavailable")


# ---------------------------------------------------------------------------
# Create report
# ---------------------------------------------------------------------------

@router.post("/api/reports", response_model=ReportPublic, status_code=201)
def create_report(payload: ReportCreate, db: Session = Depends(get_db)):
    """Submit a new water-issue report."""
    try:
        report_code = generate_report_code(db)

        report = WaterReport(
            report_code=report_code,
            reporter_name=payload.reporter_name,
            reporter_email=payload.reporter_email,
            location_name=payload.location_name,
            latitude=payload.latitude,
            longitude=payload.longitude,
            issue_category=payload.issue_category.value,
            description=payload.description,
            status=ReportStatus.PENDING.value,
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        return report
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=503, detail="Database unavailable")


# ---------------------------------------------------------------------------
# List reports (paginated, filterable)
# ---------------------------------------------------------------------------

@router.get("/api/reports", response_model=ReportListResponse)
def list_reports(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(12, ge=1, le=100, description="Items per page"),
    search: str | None = Query(None, max_length=200, description="Search report_code or location_name"),
    category: str | None = Query(None, description="Filter by issue_category"),
    status: str | None = Query(None, description="Filter by status"),
    db: Session = Depends(get_db),
):
    """Return a paginated list of reports (public fields only)."""
    try:
        query = db.query(WaterReport)

        # Filters
        if search:
            search_term = f"%{search.strip()}%"
            query = query.filter(
                WaterReport.report_code.ilike(search_term)
                | WaterReport.location_name.ilike(search_term)
            )
        if category:
            query = query.filter(WaterReport.issue_category == category)
        if status:
            query = query.filter(WaterReport.status == status)

        # Total matching count
        total = query.count()
        pages = math.ceil(total / limit) if total > 0 else 1

        # Pagination
        offset = (page - 1) * limit
        reports = query.order_by(WaterReport.created_at.desc()).offset(offset).limit(limit).all()

        return ReportListResponse(
            reports=[ReportPublic.model_validate(r) for r in reports],
            total=total,
            page=page,
            pages=pages,
        )
    except SQLAlchemyError:
        raise HTTPException(status_code=503, detail="Database unavailable")


# ---------------------------------------------------------------------------
# Get single report by code
# ---------------------------------------------------------------------------

@router.get("/api/reports/{report_code}", response_model=ReportPublic)
def get_report(report_code: str, db: Session = Depends(get_db)):
    """Return a single report by its human-readable code."""
    try:
        report = db.query(WaterReport).filter(WaterReport.report_code == report_code).first()
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        return report
    except HTTPException:
        raise
    except SQLAlchemyError:
        raise HTTPException(status_code=503, detail="Database unavailable")
