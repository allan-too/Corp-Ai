from typing import Dict
from typing import List

def send_campaign(name: str, audience: List[str], message: str) -> Dict:
    """Schedule a marketing campaign via email/SMS."""
    # TODO: integrate with marketing platform
    campaign_id = "CAMP5678"
    return {"campaign_id": campaign_id, "name": name, "status": "scheduled"}