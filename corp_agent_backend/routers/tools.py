from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from auth.auth_controller import get_current_user
from db.models import User
from tools import (
    create_lead, forecast_sales, handle_customer_query, send_campaign,
    post_social, generate_report, create_job_post, review_contract,
    plan_budget, optimize_inventory, schedule_appointment, respond_review,
    generate_invoice, update_stock, create_case, send_notification,
    make_reservation
)

router = APIRouter(prefix="/tools", tags=["tools"])

# Tool models
class ToolField(BaseModel):
    name: str
    label: str
    type: str
    placeholder: Optional[str] = None
    required: bool
    options: Optional[List[Dict[str, str]]] = None

class ToolModel(BaseModel):
    id: str
    name: str
    description: str
    category: str
    endpoint: str
    icon: str
    requiredSubscription: str
    fields: List[ToolField]

class ToolsResponse(BaseModel):
    tools: List[ToolModel]

# Mock tools data - in a real implementation, this would come from a database
TOOLS = [
    {
        "id": "crm-leads",
        "name": "Lead Generation",
        "description": "Generate potential customer leads based on your target market",
        "category": "crm",
        "endpoint": "/tools/crm",
        "icon": "C",
        "requiredSubscription": "basic",
        "fields": [
            {
                "name": "industry",
                "label": "Target Industry",
                "type": "text",
                "placeholder": "e.g., Technology, Healthcare, Finance",
                "required": True
            },
            {
                "name": "location",
                "label": "Location",
                "type": "text",
                "placeholder": "e.g., New York, Remote, Global",
                "required": True
            },
            {
                "name": "prompt",
                "label": "Additional Details",
                "type": "textarea",
                "placeholder": "Any specific requirements or characteristics of your ideal leads",
                "required": False
            }
        ]
    },
    {
        "id": "marketing-campaign",
        "name": "Campaign Creator",
        "description": "Create marketing campaigns optimized for your target audience",
        "category": "marketing",
        "endpoint": "/tools/marketing",
        "icon": "M",
        "requiredSubscription": "basic",
        "fields": [
            {
                "name": "audience",
                "label": "Target Audience",
                "type": "text",
                "placeholder": "Describe your target audience",
                "required": True
            },
            {
                "name": "goal",
                "label": "Campaign Goal",
                "type": "text",
                "placeholder": "e.g., Increase brand awareness, drive sales, etc.",
                "required": True
            },
            {
                "name": "budget",
                "label": "Budget",
                "type": "text",
                "placeholder": "Approximate budget for this campaign",
                "required": False
            }
        ]
    },
    {
        "id": "finance-budget",
        "name": "Budget Planner",
        "description": "Create and optimize budgets for your business",
        "category": "finance",
        "endpoint": "/tools/finance_budget",
        "icon": "F",
        "requiredSubscription": "professional",
        "fields": [
            {
                "name": "revenue",
                "label": "Expected Revenue",
                "type": "text",
                "placeholder": "Projected revenue for the period",
                "required": True
            },
            {
                "name": "period",
                "label": "Budget Period",
                "type": "text",
                "placeholder": "e.g., Q1 2023, Annual 2023, etc.",
                "required": True
            },
            {
                "name": "departments",
                "label": "Departments",
                "type": "textarea",
                "placeholder": "List departments and their current allocations",
                "required": False
            }
        ]
    },
    {
        "id": "hr-job-posting",
        "name": "Job Posting Creator",
        "description": "Create compelling job postings to attract top talent",
        "category": "hr",
        "endpoint": "/tools/hr_job_post",
        "icon": "H",
        "requiredSubscription": "professional",
        "fields": [
            {
                "name": "title",
                "label": "Job Title",
                "type": "text",
                "placeholder": "e.g., Senior Software Engineer",
                "required": True
            },
            {
                "name": "requirements",
                "label": "Requirements",
                "type": "textarea",
                "placeholder": "List key requirements for the position",
                "required": True
            },
            {
                "name": "benefits",
                "label": "Benefits",
                "type": "textarea",
                "placeholder": "List benefits and perks",
                "required": False
            }
        ]
    },
    {
        "id": "legal-contract",
        "name": "Contract Review",
        "description": "AI-powered contract analysis and recommendations",
        "category": "legal",
        "endpoint": "/tools/contract_review",
        "icon": "L",
        "requiredSubscription": "enterprise",
        "fields": [
            {
                "name": "contract",
                "label": "Contract Text",
                "type": "textarea",
                "placeholder": "Paste the contract text here",
                "required": True
            },
            {
                "name": "concerns",
                "label": "Specific Concerns",
                "type": "textarea",
                "placeholder": "Any specific clauses or issues you want reviewed",
                "required": False
            }
        ]
    }
]

@router.get("", response_model=ToolsResponse)
async def get_tools(current_user: User = Depends(get_current_user)):
    """Get all available tools"""
    return {"tools": TOOLS}

@router.get("/category/{category}", response_model=ToolsResponse)
async def get_tools_by_category(category: str, current_user: User = Depends(get_current_user)):
    """Get tools by category"""
    filtered_tools = [tool for tool in TOOLS if tool["category"] == category]
    return {"tools": filtered_tools}

@router.get("/{tool_id}", response_model=ToolModel)
async def get_tool_by_id(tool_id: str, current_user: User = Depends(get_current_user)):
    """Get a specific tool by ID"""
    for tool in TOOLS:
        if tool["id"] == tool_id:
            return tool
    raise HTTPException(status_code=404, detail=f"Tool with ID {tool_id} not found")


class LeadRequest(BaseModel): name: str; contact: str
class LeadResponse(BaseModel): lead_id: str; name: str; contact: str

class ForecastRequest(BaseModel): product_id: str; period: int
class ForecastResponse(BaseModel): product_id: str; period_days: int; forecast: int

class QueryRequest(BaseModel): query: str
class QueryResponse(BaseModel): query: str; response: str

class CampaignRequest(BaseModel): name: str; audience: List[str]; message: str
class CampaignResponse(BaseModel): campaign_id: str; name: str; status: str

class SocialPostRequest(BaseModel): channel: str; content: str; schedule_time: str
class SocialPostResponse(BaseModel): channel: str; post_id: str; scheduled: str

class ReportRequest(BaseModel): report_type: str; parameters: Dict
class ReportResponse(BaseModel): report_type: str; url: str

class JobPostRequest(BaseModel): title: str; description: str
class JobPostResponse(BaseModel): job_id: str; title: str

class ContractRequest(BaseModel): text: str
class ContractResponse(BaseModel): summary: str

class BudgetRequest(BaseModel): month: str; revenue: float; expenses: float
class BudgetResponse(BaseModel): month: str; surplus: float

class InventoryOptRequest(BaseModel): product_id: str
class InventoryOptResponse(BaseModel): product_id: str; reorder_quantity: int

class AppointmentRequest(BaseModel): name: str; datetime: str
class AppointmentResponse(BaseModel): appointment_id: str; datetime: str

class ReviewRequest(BaseModel): review_id: str; response: str
class ReviewResponse(BaseModel): review_id: str; status: str

class InvoiceRequest(BaseModel): client_id: str; amount: float
class InvoiceResponse(BaseModel): invoice_id: str; client_id: str; amount: float

class StockRequest(BaseModel): product_id: str; quantity: int
class StockResponse(BaseModel): product_id: str; updated_quantity: int

class CaseRequest(BaseModel): client_name: str; case_type: str
class CaseResponse(BaseModel): case_id: str; client: str; type: str

class NotificationRequest(BaseModel): method: str; recipient: str; message: str
class NotificationResponse(BaseModel): method: str; recipient: str; status: str

class ReservationRequest(BaseModel): customer: str; date: str; time: str
class ReservationResponse(BaseModel): reservation_id: str; customer: str; datetime: str

@router.post("/crm", response_model=LeadResponse)
def api_create_lead(req: LeadRequest): return create_lead(req.name, req.contact)

@router.post("/sales_forecast", response_model=ForecastResponse)
def api_forecast_sales(req: ForecastRequest): return forecast_sales(req.product_id, req.period)

@router.post("/chat_support", response_model=QueryResponse)
def api_chat_support(req: QueryRequest): return handle_customer_query(req.query)

@router.post("/marketing", response_model=CampaignResponse)
def api_send_campaign(req: CampaignRequest): return send_campaign(req.name, req.audience, req.message)

@router.post("/social_media", response_model=SocialPostResponse)
def api_post_social(req: SocialPostRequest): return post_social(req.channel, req.content, req.schedule_time)

@router.post("/analytics", response_model=ReportResponse)
def api_generate_report(req: ReportRequest): return generate_report(req.report_type, req.parameters)

@router.post("/hr/job_post", response_model=JobPostResponse)
def api_create_job(req: JobPostRequest): return create_job_post(req.title, req.description)

@router.post("/contract_review", response_model=ContractResponse)
def api_review_contract(req: ContractRequest): return review_contract(req.text)

@router.post("/finance/budget", response_model=BudgetResponse)
def api_plan_budget(req: BudgetRequest): return plan_budget(req.month, req.revenue, req.expenses)

@router.post("/supply_chain/optimize", response_model=InventoryOptResponse)
def api_optimize_inventory(req: InventoryOptRequest): return optimize_inventory(req.product_id)

@router.post("/scheduler", response_model=AppointmentResponse)
def api_schedule_appointment(req: AppointmentRequest): return schedule_appointment(req.name, req.datetime)

@router.post("/reviews/respond", response_model=ReviewResponse)
def api_respond_review(req: ReviewRequest): return respond_review(req.review_id, req.response)

@router.post("/accounting/invoice", response_model=InvoiceResponse)
def api_generate_invoice(req: InvoiceRequest): return generate_invoice(req.client_id, req.amount)

@router.post("/inventory/update", response_model=StockResponse)
def api_update_stock(req: StockRequest): return update_stock(req.product_id, req.quantity)

@router.post("/legal_crm/case", response_model=CaseResponse)
def api_create_case(req: CaseRequest): return create_case(req.client_name, req.case_type)

@router.post("/notification", response_model=NotificationResponse)
def api_send_notification(req: NotificationRequest): return send_notification(req.method, req.recipient, req.message)

@router.post("/reservation", response_model=ReservationResponse)
def api_make_reservation(req: ReservationRequest): return make_reservation(req.customer, req.date, req.time)
