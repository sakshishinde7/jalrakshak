"""Helper utilities — report code generation."""

import random
import string
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models import WaterReport

# Characters used for the random suffix (uppercase letters + digits)
_ALPHABET = string.ascii_uppercase + string.digits


def _random_suffix(length: int = 4) -> str:
    """Return a random alphanumeric string of the given length."""
    return "".join(random.choices(_ALPHABET, k=length))


def generate_report_code(db: Session) -> str:
    """Generate a unique report code like ``JR-20261028-A3K7``.

    The function checks uniqueness against the database and retries if a
    collision is detected (extremely unlikely with 36^4 ≈ 1.7 M combinations
    per day).
    """
    date_part = datetime.now(timezone.utc).strftime("%Y%m%d")
    for _ in range(10):  # up to 10 attempts
        code = f"JR-{date_part}-{_random_suffix()}"
        exists = db.query(WaterReport.id).filter(WaterReport.report_code == code).first()
        if not exists:
            return code
    # Fallback: use a 6-char suffix to virtually eliminate collisions
    return f"JR-{date_part}-{_random_suffix(6)}"
