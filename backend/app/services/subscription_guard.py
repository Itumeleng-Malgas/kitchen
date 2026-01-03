from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.order import Order
from app.models.restaurant import Restaurant
from app.domain.subscription_plans import Plan, PLAN_LIMITS

def enforce_order_limit(db: Session, restaurant_id: int):
    restaurant = db.get(Restaurant, restaurant_id)

    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    plan = Plan(restaurant.plan)
    limit = PLAN_LIMITS[plan]["max_active_orders"]

    if limit is None:
        return

    active_orders = (
        db.query(Order)
        .filter(
            Order.restaurant_id == restaurant_id,
            Order.status.notin_(["COMPLETED", "CANCELLED"]),
        )
        .count()
    )

    if active_orders >= limit:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Order limit reached. Upgrade plan.",
        )
