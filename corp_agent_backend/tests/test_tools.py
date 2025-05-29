import pytest
from datetime import datetime, timedelta
from tools import (
    create_lead, forecast_sales, handle_customer_query,
    send_campaign, post_social, generate_report,
    create_job_post, review_contract, plan_budget,
    optimize_inventory, schedule_appointment, respond_review,
    generate_invoice, update_stock, create_case,
    send_notification, make_reservation
)

def test_create_lead():
    result = create_lead("Tesla Motors", "elon@tesla.com")
    assert isinstance(result, dict)
    assert all(k in result for k in ["lead_id", "name", "contact"])
    assert result["name"] == "Tesla Motors"
    assert result["contact"] == "elon@tesla.com"

def test_forecast_sales():
    result = forecast_sales("PROD-123", 90)
    assert isinstance(result, dict)
    assert all(k in result for k in ["product_id", "period_days", "forecast"])
    assert result["product_id"] == "PROD-123"
    assert result["period_days"] == 90
    assert isinstance(result["forecast"], (int, float))

def test_handle_customer_query():
    query = "What is your refund policy?"
    result = handle_customer_query(query)
    assert isinstance(result, dict)
    assert all(k in result for k in ["query", "response"])
    assert result["query"] == query
    assert len(result["response"]) > 0

def test_post_social():
    future_date = (datetime.now() + timedelta(days=1)).isoformat()
    result = post_social(
        "linkedin",
        "Excited to announce our new AI-powered features!",
        future_date
    )
    assert isinstance(result, dict)
    assert all(k in result for k in ["channel", "post_id", "scheduled"])
    assert result["channel"] == "linkedin"
    assert result["scheduled"] == future_date

def test_create_job_post():
    result = create_job_post(
        "Senior Software Engineer",
        "We're looking for an experienced software engineer to join our AI team."
    )
    assert isinstance(result, dict)
    assert all(k in result for k in ["job_id", "title"])
    assert result["title"] == "Senior Software Engineer"

def test_review_contract():
    contract = """
    CONSULTING AGREEMENT
    
    This Agreement is made between CORP AI and the Client for consulting services.
    
    1. SERVICES
    The Consultant will provide AI consulting services.
    
    2. COMPENSATION
    Client agrees to pay $200 per hour.
    """
    result = review_contract(contract)
    assert isinstance(result, dict)
    assert "summary" in result
    assert len(result["summary"]) > 0

def test_plan_budget():
    result = plan_budget("2025-06", 150000.0, 120000.0)
    assert isinstance(result, dict)
    assert all(k in result for k in ["month", "surplus"])
    assert result["month"] == "2025-06"
    assert result["surplus"] == 30000.0

def test_optimize_inventory():
    result = optimize_inventory("SKU-789")
    assert isinstance(result, dict)
    assert all(k in result for k in ["product_id", "reorder_quantity"])
    assert result["product_id"] == "SKU-789"
    assert isinstance(result["reorder_quantity"], int)

def test_schedule_appointment():
    future_date = (datetime.now() + timedelta(days=7)).isoformat()
    result = schedule_appointment("Sarah Johnson", future_date)
    assert isinstance(result, dict)
    assert all(k in result for k in ["appointment_id", "datetime"])
    assert result["datetime"] == future_date

def test_respond_review():
    result = respond_review(
        "REV-456",
        "Thank you for your feedback. We're glad you enjoyed our service!"
    )
    assert isinstance(result, dict)
    assert all(k in result for k in ["review_id", "status"])
    assert result["review_id"] == "REV-456"

def test_generate_invoice():
    result = generate_invoice("Microsoft Corporation", 15000.0)
    assert isinstance(result, dict)
    assert all(k in result for k in ["invoice_id", "client_id", "amount"])
    assert result["amount"] == 15000.0

def test_update_stock():
    result = update_stock("PROD-456", 100)
    assert isinstance(result, dict)
    assert all(k in result for k in ["product_id", "updated_quantity"])
    assert result["product_id"] == "PROD-456"
    assert result["updated_quantity"] == 100

def test_create_case():
    result = create_case(
        "Apple Inc.",
        "intellectual_property",
        "Patent infringement case regarding AI technology."
    )
    assert isinstance(result, dict)
    assert all(k in result for k in ["case_id", "client", "type"])
    assert result["client"] == "Apple Inc."
    assert result["type"] == "intellectual_property"

def test_send_notification():
    result = send_notification(
        "email",
        "john.doe@company.com",
        "Your contract review is complete."
    )
    assert isinstance(result, dict)
    assert all(k in result for k in ["method", "recipient", "status"])
    assert result["method"] == "email"
    assert result["recipient"] == "john.doe@company.com"

def test_make_reservation():
    future_date = "2025-06-15"
    future_time = "14:30"
    result = make_reservation("Michael Bloomberg", future_date, future_time)
    assert isinstance(result, dict)
    assert all(k in result for k in ["reservation_id", "customer", "datetime"])
    assert result["customer"] == "Michael Bloomberg"
