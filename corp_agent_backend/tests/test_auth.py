import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app import app
from db.session import get_db, Base
from scripts.seed_db import main as seed_db

# Create a test database
TEST_SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    TEST_SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override the get_db dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    seed_db(drop_tables=False)
    yield
    Base.metadata.drop_all(bind=engine)

def test_register_and_login():
    # Register a new user
    response = client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "Test@123",
        "confirm_password": "Test@123",
        "first_name": "Test",
        "last_name": "User"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "user"

    # Login with the new user
    response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "Test@123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "user"

def test_admin_access():
    # Login as admin
    response = client.post("/auth/login", json={
        "email": "admin@corpai.com",
        "password": "Admin@123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "admin"
    
    # Test admin access to protected route
    headers = {"Authorization": f"Bearer {data['access_token']}"}
    response = client.get("/tools/legal", headers=headers)
    assert response.status_code == 200

def test_invalid_login():
    response = client.post("/auth/login", json={
        "email": "wrong@example.com",
        "password": "wrongpass"
    })
    assert response.status_code == 401

def test_password_validation():
    # Test weak password
    response = client.post("/auth/register", json={
        "email": "test2@example.com",
        "password": "weak",
        "confirm_password": "weak",
        "first_name": "Test",
        "last_name": "User"
    })
    assert response.status_code == 422  # Validation error

def test_protected_route_access():
    # Register and login as regular user
    client.post("/auth/register", json={
        "email": "user@example.com",
        "password": "Test@123",
        "confirm_password": "Test@123",
        "first_name": "Test",
        "last_name": "User"
    })
    
    response = client.post("/auth/login", json={
        "email": "user@example.com",
        "password": "Test@123"
    })
    token = response.json()["access_token"]
    
    # Try to access enterprise-only route
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/tools/legal", headers=headers)
    assert response.status_code == 403  # Forbidden
    # Subscribe to plan ID 1 (assumes seed created plan id 1)
    response = client.post(
        "/auth/subscribe",
        headers={"Authorization": f"Bearer {token}"},
        json={"plan_id": 1}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["plan"] in ["free", "pro", "enterprise"]
    assert data["active"] is True
