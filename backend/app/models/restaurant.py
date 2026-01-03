from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base
from app.domain.subscription_plans import Plan

class Restaurant(Base):
    __tablename__ = "restaurants"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    owner_id: Mapped[int] = mapped_column(index=True)

    plan: Mapped[str] = mapped_column(
        String(20),
        default=Plan.FREE.value,
        index=True,
    )

    orders = relationship("Order", back_populates="restaurant")
