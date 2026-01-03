from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.order import Order
from app.domain.payment_states import PaymentStatus
from app.core.permissions import require_role

router = APIRouter(prefix="/payments", tags=["payments"])

@router.post("/{order_id}/authorize")
def authorize_payment(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("owner", "manager")),
):
    order = db.get(Order, order_id)
    order.payment_status = PaymentStatus.AUTHORIZED.value
    db.commit()
    return order

@router.post("/{order_id}/capture")
def capture_payment(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("owner", "manager")),
):
    order = db.get(Order, order_id)
    order.payment_status = PaymentStatus.PAID.value
    db.commit()
    return order
