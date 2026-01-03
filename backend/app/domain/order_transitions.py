from app.domain.order_states import OrderStatus

# This prevents illegal jumps (e.g. CREATED → READY).
VALID_TRANSITIONS = {
    OrderStatus.CREATED: {
        OrderStatus.PAID,
        OrderStatus.CANCELLED,
    },
    OrderStatus.PAID: {
        OrderStatus.ACCEPTED,
        OrderStatus.CANCELLED,
    },
    OrderStatus.ACCEPTED: {
        OrderStatus.PREPARING,
    },
    OrderStatus.PREPARING: {
        OrderStatus.READY,
    },
    OrderStatus.READY: {
        OrderStatus.OUT_FOR_DELIVERY,
    },
    OrderStatus.OUT_FOR_DELIVERY: {
        OrderStatus.COMPLETED,
    },
}
