"""Comprehensive unit and endpoint tests for JALRAKSHAK FastAPI backend."""

import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

# Create in-memory SQLite database for testing
TEST_DB_URL = "sqlite:///:memory:"
test_engine = create_engine(
    TEST_DB_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

# Create tables in test db
Base.metadata.create_all(bind=test_engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Apply dependency override
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "JALRAKSHAK API"
    assert data["version"] == "1.0.0"
    print("PASS: test_root")

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"
    print("PASS: test_health")

def test_stats_initial_empty():
    response = client.get("/api/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert data["pending"] == 0
    assert data["under_investigation"] == 0
    assert data["resolved"] == 0
    assert data["by_category"]["Water Pollution"] == 0
    print("PASS: test_stats_initial_empty")

def test_create_report_success():
    payload = {
        "reporter_name": "Ravi Kumar",
        "reporter_email": "ravi@example.org",
        "location_name": "Bellandur Lake North Inlet, Bengaluru",
        "latitude": 12.9352,
        "longitude": 77.6675,
        "issue_category": "Sewage Contamination",
        "description": "Dense foam and untreated sewage entering the inlet stream.",
    }
    response = client.post("/api/reports", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "report_code" in data
    assert data["report_code"].startswith("JR-")
    assert data["location_name"] == payload["location_name"]
    assert data["issue_category"] == "Sewage Contamination"
    assert data["status"] == "Pending"
    # Verify reporter_email is NOT exposed in public response
    assert "reporter_email" not in data
    print(f"PASS: test_create_report_success -> generated {data['report_code']}")
    return data["report_code"]

def test_create_second_report():
    payload = {
        "reporter_name": "Kavita Sen",
        "location_name": "Yamuna Ghat Sector 15",
        "issue_category": "Plastic Waste",
        "description": "Heavy accumulation of single-use plastic bottles along the riverbank.",
    }
    response = client.post("/api/reports", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["report_code"].startswith("JR-")
    print(f"PASS: test_create_second_report -> generated {data['report_code']}")
    return data["report_code"]

def test_stats_after_creation():
    response = client.get("/api/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert data["pending"] == 2
    assert data["by_category"]["Sewage Contamination"] == 1
    assert data["by_category"]["Plastic Waste"] == 1
    print("PASS: test_stats_after_creation (counts updated dynamically)")

def test_list_reports(code1, code2):
    response = client.get("/api/reports")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert len(data["reports"]) == 2
    codes = [r["report_code"] for r in data["reports"]]
    assert code1 in codes
    assert code2 in codes
    # Ensure reporter emails are never returned
    for r in data["reports"]:
        assert "reporter_email" not in r
    print("PASS: test_list_reports")

def test_filter_and_search(code1):
    # Filter by category
    res_cat = client.get("/api/reports?category=Sewage Contamination")
    assert res_cat.status_code == 200
    data = res_cat.json()
    assert data["total"] == 1
    assert data["reports"][0]["report_code"] == code1

    # Search by code
    res_search = client.get(f"/api/reports?search={code1}")
    assert res_search.status_code == 200
    assert res_search.json()["total"] == 1

    # Search by partial location
    res_loc = client.get("/api/reports?search=Bellandur")
    assert res_loc.status_code == 200
    assert res_loc.json()["total"] == 1

    # Search non-existent
    res_none = client.get("/api/reports?search=XYZNONEXISTENT")
    assert res_none.status_code == 200
    assert res_none.json()["total"] == 0
    print("PASS: test_filter_and_search")

def test_get_single_report(code1):
    response = client.get(f"/api/reports/{code1}")
    assert response.status_code == 200
    data = response.json()
    assert data["report_code"] == code1
    assert "Bellandur" in data["location_name"]
    assert "reporter_email" not in data

    # 404 for non-existent
    res_404 = client.get("/api/reports/JR-99999999-XXXX")
    assert res_404.status_code == 404
    print("PASS: test_get_single_report & 404 handling")

def test_validation_errors():
    # Missing required name
    bad_payload_1 = {
        "reporter_name": "",
        "location_name": "Test Location",
        "issue_category": "Other",
        "description": "Some description",
    }
    res1 = client.post("/api/reports", json=bad_payload_1)
    assert res1.status_code == 422

    # Invalid email format
    bad_payload_2 = {
        "reporter_name": "Valid Name",
        "reporter_email": "not-an-email",
        "location_name": "Valid Location",
        "issue_category": "Other",
        "description": "Valid description",
    }
    res2 = client.post("/api/reports", json=bad_payload_2)
    assert res2.status_code == 422

    # Invalid latitude out of range
    bad_payload_3 = {
        "reporter_name": "Valid Name",
        "location_name": "Valid Location",
        "latitude": 150.0,  # max is 90
        "issue_category": "Other",
        "description": "Valid description",
    }
    res3 = client.post("/api/reports", json=bad_payload_3)
    assert res3.status_code == 422
    print("PASS: test_validation_errors (422 Unprocessable Entity)")

if __name__ == "__main__":
    print("\n--- Running JALRAKSHAK API Test Suite ---\n")
    test_root()
    test_health()
    test_stats_initial_empty()
    code1 = test_create_report_success()
    code2 = test_create_second_report()
    test_stats_after_creation()
    test_list_reports(code1, code2)
    test_filter_and_search(code1)
    test_get_single_report(code1)
    test_validation_errors()
    print("\n==========================================")
    print("ALL 8 API & VALIDATION TESTS PASSED 100%!")
    print("==========================================\n")

