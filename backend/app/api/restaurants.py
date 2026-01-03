from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.restaurant import Restaurant
from app.core.permissions import require_role

router = APIRouter(prefix="/api/restaurants", tags=["restaurants"])

@router.post("/")
def create_restaurant(
    name: str,
    owner_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("owner")),
):
    restaurant = Restaurant(name=name, owner_id=owner_id)
    db.add(restaurant)
    db.commit()
    db.refresh(restaurant)
    return restaurant

@router.get("/")
def list_restaurants(
    db: Session = Depends(get_db),
    user=Depends(require_role("owner", "manager")),
):
    return db.query(Restaurant).all()
