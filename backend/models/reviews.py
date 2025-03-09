from pydantic import BaseModel, Field

class ReviewModel(BaseModel):
    service_id: str
    name: str
    rating: float = Field(..., ge=1, le=5)
    comment: str