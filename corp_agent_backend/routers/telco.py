"""
FastAPI router for Telecom AI Operations & Insights Tool.
"""

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from typing import List, Dict, Optional
from datetime import datetime
import pandas as pd
import io
import json
from sqlalchemy.orm import Session

from ..database import get_db
from ..auth import get_current_user
from ..models.user import User
from ..models.telco import TelcoReport
from ..tools.telco_tool import (
    parse_telco_data,
    predict_maintenance,
    score_churn,
    detect_fraud,
    analyze_calls,
    optimize_network,
    generate_pdf_report,
    Alert,
    TransactionFlag,
    CallAnalysisResult,
    OptimizationPlan
)

router = APIRouter(
    prefix="/tools/telco",
    tags=["telco"],
    responses={404: {"description": "Not found"}}
)

def check_telco_access(user: User = Depends(get_current_user)):
    """Check if user has access to telco tools."""
    allowed_roles = ["admin", "network_ops", "fraud_team"]
    if user.role not in allowed_roles:
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to access telco tools"
        )
    return user

@router.post("/upload", response_model=Dict)
async def upload_telco_data(
    file: UploadFile = File(...),
    user: User = Depends(check_telco_access),
    db: Session = Depends(get_db)
):
    """Upload and process telco data files (CDR, KPI, logs)."""
    try:
        # Read file content
        content = await file.read()
        
        # Save to temporary file
        temp_file = f"/tmp/{file.filename}"
        with open(temp_file, "wb") as f:
            f.write(content)
        
        # Parse data
        df = parse_telco_data(temp_file)
        
        # Store metadata in database
        report = TelcoReport(
            filename=file.filename,
            uploaded_by=user.id,
            upload_date=datetime.now(),
            record_count=len(df)
        )
        db.add(report)
        db.commit()
        
        return {
            "message": "File uploaded successfully",
            "rows": len(df),
            "report_id": report.id
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/maintenance", response_model=List[Alert])
async def check_maintenance(
    file: UploadFile = File(...),
    user: User = Depends(check_telco_access)
):
    """Analyze equipment data and return maintenance alerts."""
    try:
        content = await file.read()
        temp_file = f"/tmp/{file.filename}"
        with open(temp_file, "wb") as f:
            f.write(content)
        
        df = parse_telco_data(temp_file)
        alerts = predict_maintenance(df)
        return alerts
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/churn", response_model=float)
async def analyze_churn(
    file: UploadFile = File(...),
    user: User = Depends(check_telco_access)
):
    """Calculate customer churn risk score."""
    try:
        content = await file.read()
        temp_file = f"/tmp/{file.filename}"
        with open(temp_file, "wb") as f:
            f.write(content)
        
        df = parse_telco_data(temp_file)
        score = score_churn(df)
        return score
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/fraud", response_model=List[TransactionFlag])
async def check_fraud(
    file: UploadFile = File(...),
    user: User = Depends(check_telco_access)
):
    """Detect suspicious transactions."""
    try:
        content = await file.read()
        temp_file = f"/tmp/{file.filename}"
        with open(temp_file, "wb") as f:
            f.write(content)
        
        df = parse_telco_data(temp_file)
        flags = detect_fraud(df)
        return flags
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/call_analysis", response_model=CallAnalysisResult)
async def analyze_call(
    file: UploadFile = File(...),
    user: User = Depends(check_telco_access)
):
    """Analyze call audio for sentiment and insights."""
    try:
        content = await file.read()
        result = analyze_calls(content)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/optimize", response_model=OptimizationPlan)
async def optimize_network_capacity(
    file: UploadFile = File(...),
    user: User = Depends(check_telco_access)
):
    """Generate network optimization recommendations."""
    try:
        content = await file.read()
        temp_file = f"/tmp/{file.filename}"
        with open(temp_file, "wb") as f:
            f.write(content)
        
        df = parse_telco_data(temp_file)
        plan = optimize_network(df)
        return plan
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/report")
async def generate_report(
    data: Dict,
    background_tasks: BackgroundTasks,
    user: User = Depends(check_telco_access)
):
    """Generate PDF report with insights and visualizations."""
    try:
        pdf = generate_pdf_report(data)
        
        # Return PDF as streaming response
        return StreamingResponse(
            io.BytesIO(pdf),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=telco_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
