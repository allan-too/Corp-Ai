"""
Finance API Router - Handles financial analysis endpoints
"""
from fastapi import APIRouter, Depends, UploadFile, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse, FileResponse
from typing import Dict, Any, Optional, List
from tools.finance_tool import FinanceTool
from auth.auth_controller import get_current_user
from models.user import User
from models.finance import FinanceReport, Budget
from db.session import get_db
from sqlalchemy.orm import Session
import os
from pathlib import Path
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(
    prefix="/tools/finance",
    tags=["finance"],
    responses={404: {"description": "Not found"}}
)

finance_tool = FinanceTool()

# Budget request model
class BudgetRequest(BaseModel):
    month: str
    revenue: float
    expenses: float

# Budget response model
class BudgetResponse(BaseModel):
    id: Optional[int] = None
    month: str
    revenue: float
    expenses: float
    surplus: float
    created_at: Optional[datetime] = None

def check_finance_access(user: User = Depends(get_current_user)):
    """Verify user has finance or admin role"""
    if user.role not in ['admin', 'finance']:
        raise HTTPException(
            status_code=403,
            detail="Requires finance or admin role"
        )
    return user

@router.post("/analyze")
async def analyze_file(
    file: UploadFile,
    user: User = Depends(check_finance_access),
    db: Session = Depends(get_db)
):
    """Analyze uploaded financial spreadsheet"""
    if not file.filename.endswith(('.xlsx', '.csv')):
        raise HTTPException(
            status_code=400,
            detail="File must be .xlsx or .csv"
        )
    
    try:
        analysis = await finance_tool.analyze_spreadsheet(file)
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )

@router.post("/insights")
async def generate_insights(
    data: Dict[str, Any],
    user: User = Depends(check_finance_access)
):
    """Generate LLM insights from financial data"""
    try:
        insights = await finance_tool.generate_insights(data)
        return {"insights": insights}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate insights: {str(e)}"
        )

@router.post("/report")
async def create_report(
    data: Dict[str, Any],
    background_tasks: BackgroundTasks,
    user: User = Depends(check_finance_access),
    db: Session = Depends(get_db)
):
    """Generate PDF report with insights and charts"""
    try:
        # Generate insights and charts
        insights = await finance_tool.generate_insights(data)
        charts = finance_tool.create_charts(data)
        
        # Create PDF
        pdf_content = await finance_tool.create_pdf_report(insights, charts)
        
        # Save report metadata
        report = FinanceReport(
            user_id=user.id,
            report_type="financial_analysis",
            status="completed"
        )
        db.add(report)
        db.commit()
        
        # Save PDF file
        reports_dir = Path("data/reports")
        reports_dir.mkdir(exist_ok=True)
        
        pdf_path = reports_dir / f"report_{report.id}.pdf"
        with open(pdf_path, "wb") as f:
            f.write(pdf_content)
            
        return {
            "report_id": report.id,
            "status": "completed",
            "download_url": f"/tools/finance/reports/{report.id}/download"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Report generation failed: {str(e)}"
        )

@router.get("/reports/{report_id}/download")
async def download_report(
    report_id: int,
    user: User = Depends(check_finance_access),
    db: Session = Depends(get_db)
):
    """Download generated PDF report"""
    report = db.query(FinanceReport).filter(FinanceReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    if report.user_id != user.id and user.role != 'admin':
        raise HTTPException(status_code=403, detail="Access denied")
        
    pdf_path = Path(f"data/reports/report_{report_id}.pdf")
    if not pdf_path.exists():
        raise HTTPException(status_code=404, detail="Report file not found")
        
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"financial_report_{report_id}.pdf"
    )

@router.post("/budget", response_model=BudgetResponse)
async def create_budget(
    budget_data: BudgetRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new budget plan"""
    try:
        # Calculate surplus
        surplus = budget_data.revenue - budget_data.expenses
        
        # Create budget record
        new_budget = Budget(
            user_id=user.id,
            month=budget_data.month,
            revenue=budget_data.revenue,
            expenses=budget_data.expenses,
            surplus=surplus
        )
        
        db.add(new_budget)
        db.commit()
        db.refresh(new_budget)
        
        return BudgetResponse(
            id=new_budget.id,
            month=new_budget.month,
            revenue=new_budget.revenue,
            expenses=new_budget.expenses,
            surplus=new_budget.surplus,
            created_at=new_budget.created_at
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create budget: {str(e)}"
        )

@router.get("/budgets", response_model=List[BudgetResponse])
async def get_budgets(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all budgets for the current user"""
    try:
        budgets = db.query(Budget).filter(Budget.user_id == user.id).all()
        
        return [
            BudgetResponse(
                id=budget.id,
                month=budget.month,
                revenue=budget.revenue,
                expenses=budget.expenses,
                surplus=budget.surplus,
                created_at=budget.created_at
            ) for budget in budgets
        ]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve budgets: {str(e)}"
        )
