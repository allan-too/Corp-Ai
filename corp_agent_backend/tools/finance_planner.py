from typing import Dict

def plan_budget(month: str, revenue: float, expenses: float) -> Dict:
    """Provide budgeting and cashflow insights."""
    # TODO: implement financial planning logic
    surplus = revenue - expenses
    return {"month": month, "surplus": surplus}