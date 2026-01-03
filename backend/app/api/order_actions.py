from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.domain.order_states import OrderStatus
from app.services.order_state_machine import transition_order
from app.core.permissions import require_role

router = APIRouter(prefix="/api/orders/actions", tags=["order-actions"])

@router.post("/{order_id}/pay")
def mark_paid(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("owner", "manager")),
):
    return transition_order(
        db=db,
        order_id=order_id,
        new_status=OrderStatus.PAID,
    )

@router.post("/{order_id}/accept")
def accept_order(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("kitchen", "owner")),
):
    return transition_order(
        db=db,
        order_id=order_id,
        new_status=OrderStatus.ACCEPTED,
    )

@router.post("/{order_id}/prepare")
def start_preparing(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("kitchen")),
):
    return transition_order(
        db=db,
        order_id=order_id,
        new_status=OrderStatus.PREPARING,
    )

@router.post("/{order_id}/ready")
def mark_ready(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("kitchen")),
):
    return transition_order(
        db=db,
        order_id=order_id,
        new_status=OrderStatus.READY,
    )

@router.post("/{order_id}/dispatch")
def dispatch_order(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("rider")),
):
    return transition_order(
        db=db,
        order_id=order_id,
        new_status=OrderStatus.OUT_FOR_DELIVERY,
    )

@router.post("/{order_id}/complete")
def complete_order(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("rider")),
):
    return transition_order(
        db=db,
        order_id=order_id,
        new_status=OrderStatus.COMPLETED,
    )
