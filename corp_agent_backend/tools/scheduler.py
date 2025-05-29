from typing import Dict

def schedule_appointment(name: str, datetime: str) -> Dict:
    """Schedule an appointment and send reminders."""
    # TODO: integrate with calendar API
    appt_id = "APPT7890"
    return {"appointment_id": appt_id, "datetime": datetime}