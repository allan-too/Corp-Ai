"""
Finance Tool for CORP AI - Provides spreadsheet analysis, LLM insights, and report generation
"""
from typing import Dict, Any, List, Optional
from pathlib import Path
import pandas as pd
from langchain import LLMChain, PromptTemplate
from langchain.llms import LlamaCpp
from fastapi import UploadFile
import plotly.express as px
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
import json
import io

class FinanceTool:
    def __init__(self, model_path: str = "models/llama-2-7b-finance.gguf"):
        try:
            import os
            if os.path.exists(model_path):
                self.llm = LlamaCpp(
                    model_path=model_path,
                    temperature=0.1,
                    max_tokens=2000,
                    n_ctx=2048,
                    n_gpu_layers=1
                )
            else:
                import logging
                logging.warning(f"Model not found at {model_path}. Content generation will be unavailable.")
                self.llm = None
        except Exception as e:
            import logging
            logging.error(f"Error loading LLM model: {str(e)}")
            self.llm = None
        
        self.insight_prompt = PromptTemplate(
            template="""Analyze the following financial data and provide insights:
            
            {data}
            
            Focus on:
            1. Key trends and patterns
            2. Notable anomalies
            3. Forward-looking predictions
            4. Recommendations
            
            Response:""",
            input_variables=["data"]
        )
        
        if self.llm is not None:
            self.insight_chain = LLMChain(llm=self.llm, prompt=self.insight_prompt)
        else:
            self.insight_chain = None

    async def analyze_spreadsheet(self, file: UploadFile) -> Dict[str, Any]:
        """Parse uploaded spreadsheet and extract key metrics"""
        content = await file.read()
        df = pd.read_excel(content) if file.filename.endswith('.xlsx') else pd.read_csv(content)
        
        # Basic analysis
        analysis = {
            "summary": {
                "total_rows": len(df),
                "columns": list(df.columns),
                "numeric_columns": list(df.select_dtypes(include=['float64', 'int64']).columns)
            },
            "metrics": self._calculate_metrics(df),
            "trends": self._analyze_trends(df)
        }
        
        return analysis

    def _calculate_metrics(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Calculate key financial metrics from dataframe"""
        numeric_cols = df.select_dtypes(include=['float64', 'int64']).columns
        metrics = {}
        
        for col in numeric_cols:
            metrics[col] = {
                "sum": df[col].sum(),
                "mean": df[col].mean(),
                "median": df[col].median(),
                "std": df[col].std(),
                "min": df[col].min(),
                "max": df[col].max()
            }
        
        return metrics

    def _analyze_trends(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Identify trends in time series data"""
        if 'date' not in df.columns and 'Date' not in df.columns:
            return {"error": "No date column found"}
            
        date_col = 'date' if 'date' in df.columns else 'Date'
        df[date_col] = pd.to_datetime(df[date_col])
        
        trends = {}
        numeric_cols = df.select_dtypes(include=['float64', 'int64']).columns
        
        for col in numeric_cols:
            monthly = df.groupby(df[date_col].dt.to_period('M'))[col].agg(['mean', 'sum'])
            trends[col] = {
                "monthly_totals": monthly['sum'].to_dict(),
                "monthly_averages": monthly['mean'].to_dict()
            }
            
        return trends

    async def generate_insights(self, data: Dict[str, Any]) -> str:
        """Generate LLM insights from analyzed data"""
        if self.llm is None:
            return "LLM model is not available. Unable to generate insights. Please ensure the model file exists and is accessible."
            
        try:
            data_str = json.dumps(data, indent=2)
            response = await self.insight_chain.arun(data=data_str)
            return response
        except Exception as e:
            import logging
            logging.error(f"Error generating insights: {str(e)}")
            return f"Error generating insights: {str(e)}"

    def create_charts(self, data: Dict[str, Any]) -> List[bytes]:
        """Generate charts from analyzed data"""
        charts = []
        
        # Example: Create trend charts
        for metric, values in data['trends'].items():
            if isinstance(values, dict) and 'monthly_totals' in values:
                df = pd.DataFrame(values['monthly_totals'].items(), columns=['date', 'value'])
                fig = px.line(df, x='date', y='value', title=f'{metric} Over Time')
                
                img_bytes = io.BytesIO()
                fig.write_image(img_bytes, format='png')
                charts.append(img_bytes.getvalue())
        
        return charts

    async def create_pdf_report(self, insights: str, charts: List[bytes]) -> bytes:
        """Generate PDF report with insights and charts"""
        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)
        
        # Add title
        c.setFont("Helvetica-Bold", 24)
        c.drawString(50, 750, "Financial Analysis Report")
        
        # Add insights
        c.setFont("Helvetica", 12)
        y = 700
        for line in insights.split('\n'):
            if y < 50:  # New page if needed
                c.showPage()
                y = 750
            c.drawString(50, y, line)
            y -= 15
            
        # Add charts
        for chart in charts:
            c.showPage()
            c.drawImage(io.BytesIO(chart), 50, 500, width=500, height=300)
            
        c.save()
        return buffer.getvalue()
