from datetime import datetime, timezone
from typing import Optional

from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint, ForeignKey, Index, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

USER_ROLES = ("admin", "worker", "master")
ORDER_STATUSES = ("Pending", "In Progress", "Ready")


class User(UserMixin, db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(80), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(256), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False, default="worker")
    phone: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)

    orders: Mapped[list["Order"]] = relationship(
        "Order",
        back_populates="worker",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        CheckConstraint(
            f"role IN {USER_ROLES}",
            name="ck_users_role",
        ),
    )

    def is_admin(self) -> bool:
        return self.role == "admin"

    def is_master(self) -> bool:
        return self.role == "master"

    def is_worker(self) -> bool:
        return self.role in ("worker", "master")

    def __repr__(self) -> str:
        return f"<User id={self.id} username={self.username!r} role={self.role!r}>"


class Car(db.Model):
    __tablename__ = "cars"

    id: Mapped[int] = mapped_column(primary_key=True)
    brand: Mapped[str] = mapped_column(String(80), nullable=False)
    model: Mapped[str] = mapped_column(String(80), nullable=False)
    license_plate: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    owner_phone: Mapped[str] = mapped_column(String(30), nullable=False)

    orders: Mapped[list["Order"]] = relationship(
        "Order",
        back_populates="car",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        UniqueConstraint("license_plate", name="uq_cars_license_plate"),
    )

    def __repr__(self) -> str:
        return (
            f"<Car id={self.id} brand={self.brand!r} model={self.model!r} "
            f"license_plate={self.license_plate!r}>"
        )


class Service(db.Model):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    price: Mapped[float] = mapped_column(nullable=False, default=0.0)
    duration_mins: Mapped[int] = mapped_column(nullable=False)

    orders: Mapped[list["Order"]] = relationship(
        "Order",
        back_populates="service",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        CheckConstraint("price IS NOT NULL", name="ck_services_price_not_null"),
        CheckConstraint("price >= 0", name="ck_services_price_non_negative"),
        CheckConstraint("duration_mins > 0", name="ck_services_duration_positive"),
    )

    def __repr__(self) -> str:
        return f"<Service id={self.id} name={self.name!r} price={self.price}>"


class Order(db.Model):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)
    car_id: Mapped[int] = mapped_column(ForeignKey("cars.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    service_id: Mapped[int] = mapped_column(
        ForeignKey("services.id", ondelete="CASCADE"),
        nullable=False,
    )
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="Pending")
    total_price: Mapped[float] = mapped_column(nullable=False, default=0.0)
    photo_before: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    photo_after: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    car: Mapped["Car"] = relationship("Car", back_populates="orders")
    worker: Mapped["User"] = relationship("User", back_populates="orders")
    service: Mapped["Service"] = relationship("Service", back_populates="orders")
    image_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    __table_args__ = (
        CheckConstraint(
            f"status IN {ORDER_STATUSES}",
            name="ck_orders_status",
        ),
        CheckConstraint("total_price IS NOT NULL", name="ck_orders_total_price_not_null"),
        CheckConstraint("total_price >= 0", name="ck_orders_total_price_non_negative"),
        Index("ix_orders_status", "status"),
        Index("ix_orders_created_at", "created_at"),
        Index("ix_orders_user_id", "user_id"),
    )

    @property
    def master(self) -> "User":
        return self.worker

    def __repr__(self) -> str:
        return (
            f"<Order id={self.id} car_id={self.car_id} user_id={self.user_id} "
            f"status={self.status!r} total_price={self.total_price}>"
        )
