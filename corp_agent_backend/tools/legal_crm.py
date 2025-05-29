from typing import Dict
# Tool: track legal cases and generate documents

def create_case(client_name: str, case_type: str) -> Dict:
    # TODO: insert into legal CRM system
    case_id = "CASE4321"
    return {"case_id": case_id, "client": client_name, "type": case_type}