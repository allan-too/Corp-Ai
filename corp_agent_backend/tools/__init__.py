"""
Tool package for CORP AI agent.
Each module exports one or more tool functions.
"""
from .crm import create_lead
from .sales_forecast import forecast_sales
from .chat_support import handle_customer_query
from .marketing import send_campaign
from .social_media import post_social
from langchain.tools import Tool, BaseTool
from .analytics import generate_report
from .hr_assistant import create_job_post
from .contract_review import review_contract
from .finance_planner import plan_budget
from .supply_chain import optimize_inventory
from .scheduler import schedule_appointment
from .review_management import respond_review
from .accounting import generate_invoice
from .inventory import update_stock
from .legal_crm import create_case
from .notification import send_notification
from .reservation import make_reservation

__all__ = [
    "create_lead", "forecast_sales", "handle_customer_query", "send_campaign",
    "post_social", "generate_report", "create_job_post", "review_contract",
    "plan_budget", "optimize_inventory", "schedule_appointment", "respond_review",
    "generate_invoice", "update_stock", "create_case", "send_notification",
    "make_reservation"
    ]  # type: ignore