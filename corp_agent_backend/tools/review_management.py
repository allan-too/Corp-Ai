from typing import Dict

def respond_review(review_id: str, response: str) -> Dict:
    """Respond to an online customer review."""
    # TODO: integrate with review platform API
    return {"review_id": review_id, "status": "responded"}