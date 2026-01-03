from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.core.permissions import require_role
from app.infrastructure.event_bus import publish_order_event
from app.services.subscription_guard import enforce_order_limit

router = APIRouter(prefix="/api/orders", tags=["orders"])

@router.post("/")
def create_order(
    restaurant_id: int,
    user_id: int,
    items: list[dict],
    db: Session = Depends(get_db),
    user=Depends(require_role("owner", "manager")),
):
    enforce_order_limit(db, restaurant_id)
    
    order = Order(
        restaurant_id=restaurant_id,
        user_id=user_id,
    )

    total = 0
    for item in items:
        order_item = OrderItem(
            product_name=item["product_name"],
            quantity=item["quantity"],
            unit_price=item["unit_price"],
        )
        total += item["quantity"] * item["unit_price"]
        order.items.append(order_item)

    order.total_amount = total
    db.add(order)
    db.commit()
    db.refresh(order)

    publish_order_event({
        "type": "ORDER_CREATED",
        "order_id": order.id,
        "restaurant_id": order.restaurant_id,
        "status": order.status,
        "total": float(order.total_amount),
    })

    return order

@router.get("/")
def list_orders(
    db: Session = Depends(get_db),
    user=Depends(require_role("owner", "manager", "kitchen")),
):
    return db.query(Order).all()
