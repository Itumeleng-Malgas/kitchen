from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.order import Order
from app.domain.order_states import OrderStatus
from app.domain.order_transitions import VALID_TRANSITIONS

from app.infrastructure.event_bus import publish_order_event

def transition_order(*, db, order_id, new_status):
    order = db.get(Order, order_id)

    if not order:
        raise HTTPException(status_code=404)

    current = OrderStatus(order.status)
    allowed = VALID_TRANSITIONS.get(current, set())

    if new_status not in allowed:
        raise HTTPException(status_code=409)

    order.status = new_status.value
    db.commit()
    db.refresh(order)

    publish_order_event({
        "type": "ORDER_STATUS_CHANGED",
        "order_id": order.id,
        "restaurant_id": order.restaurant_id,
        "status": order.status,
    })

    return order

