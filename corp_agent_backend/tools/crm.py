from typing import Dict

def create_lead(name: str, contact: str) -> Dict:
    """Create a new sales lead."""
    # TODO: insert into CRM database
    lead_id = "LEAD1234"
    return {"lead_id": lead_id, "name": name, "contact": contact}