"""
SQLAlchemy models for Telecom AI Operations & Insights Tool.
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship

from ..database import Base

class TelcoReport(Base):
    """Model for storing telco report metadata."""
    __tablename__ = "telco_reports"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    upload_date = Column(DateTime, nullable=False)
    record_count = Column(Integer)
    report_type = Column(String)  # e.g., 'maintenance', 'churn', 'fraud'
    insights = Column(JSON)  # Store any generated insights
    metrics = Column(JSON)  # Store key metrics
    
    # Relationships
    user = relationship("User", back_populates="telco_reports")

    class Config:
        orm_mode = True
