from sqlalchemy import ForeignKey, String, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base
from app.domain.order_states import OrderStatus
from app.domain.payment_states import PaymentStatus

class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)

    restaurant_id: Mapped[int] = mapped_column(
        ForeignKey("restaurants.id", ondelete="CASCADE")
    )

    user_id: Mapped[int] = mapped_column(index=True)

    status: Mapped[str] = mapped_column(
        String(50),
        default=OrderStatus.CREATED.value,
        index=True,
    )

    total_amount: Mapped[float] = mapped_column(Numeric(10, 2), default=0)

    payment_status: Mapped[str] = mapped_column(
        String(20),
        default=PaymentStatus.PENDING.value,
        index=True,
    )

    restaurant = relationship("Restaurant", back_populates="orders")
    items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
    )
