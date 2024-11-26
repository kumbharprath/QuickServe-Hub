from pydantic import BaseModel
from typing import List, Optional

class FilterParams(BaseModel):
    service_type: Optional[str]
    max_distance_km: Optional[float] = 5
    user_lat: Optional[float]
    user_lng: Optional[float]
    min_rating: Optional[float] = 0
