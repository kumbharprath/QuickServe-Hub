from pydantic import BaseModel
from typing import Optional, List
from datetime import time, date

class DoctorAvailability(BaseModel):
    day: str
    time_slots : List[str]
    Available: bool
    max_patients: int
    avg_consultation_time: int

class QueueSlot(BaseModel):
    patient_name: str
    queue_position: int
    estimated_time: int

class Patient(BaseModel):
    patient_name: str
    contact_number: int
    time_slot: str