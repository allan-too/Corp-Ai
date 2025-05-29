from typing import Dict
# Tool: handle hotel and restaurant reservations

def make_reservation(customer: str, date: str, time: str) -> Dict:
    # TODO: insert into reservation system
    reservation_id = "RES6789"
    return {"reservation_id": reservation_id, "customer": customer, "datetime": f"{date} {time}"}
