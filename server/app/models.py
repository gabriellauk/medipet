from datetime import datetime
import sqlalchemy as sa
import sqlalchemy.orm as so
from sqlalchemy.orm import relationship
from flask_login import UserMixin

from app.extensions import db

from enum import Enum


class User(UserMixin, db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    email: so.Mapped[str] = so.mapped_column(sa.String(120), unique=True, nullable=False)

    def __repr__(self):
        return "<User {}>".format(self.email)


class AnimalType(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(30), unique=True, nullable=False)


class Animal(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(30), nullable=False)
    user_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey(User.id), index=True, nullable=False)
    animal_type_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey(AnimalType.id), index=True, nullable=False)

    user = relationship("User")
    animal_type = relationship("AnimalType")


class Symptom(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    description: so.Mapped[str] = so.mapped_column(sa.String(240), nullable=False)
    date: so.Mapped[datetime.date] = so.mapped_column(sa.Date, nullable=False)
    animal_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey(Animal.id), index=True, nullable=False)

    animal = relationship("Animal")


class Weight(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    weight: so.Mapped[int] = so.mapped_column(sa.Integer, nullable=False)
    date: so.Mapped[datetime.date] = so.mapped_column(sa.Date, nullable=False)
    animal_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey(Animal.id), index=True, nullable=False)

    animal = relationship("Animal")


class Appointment(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    description: so.Mapped[str] = so.mapped_column(sa.String(240), nullable=False)
    date: so.Mapped[datetime.date] = so.mapped_column(sa.Date, nullable=False)
    notes: so.Mapped[str | None] = so.mapped_column(sa.String(750), nullable=True)
    animal_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey(Animal.id), index=True, nullable=False)

    animal = relationship("Animal")


class TimeUnit(Enum):
    DAY = "day"
    WEEK = "week"
    MONTH = "month"
    YEAR = "year"


def get_enum_values(enum_class):
    return [member.value for member in enum_class]


class Medication(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(30), nullable=False)
    is_recurring: so.Mapped[bool] = so.mapped_column(sa.Boolean, default=False, nullable=False)
    times_per_day: so.Mapped[int | None] = so.mapped_column(sa.Integer, nullable=True)
    frequency_number: so.Mapped[int | None] = so.mapped_column(sa.Integer, nullable=True)
    frequency_unit: so.Mapped[TimeUnit | None] = so.mapped_column(
        sa.Enum(TimeUnit, values_callable=get_enum_values), nullable=True
    )
    duration_number: so.Mapped[int | None] = so.mapped_column(sa.Integer, nullable=True)
    duration_unit: so.Mapped[TimeUnit | None] = so.mapped_column(
        sa.Enum(TimeUnit, values_callable=get_enum_values), nullable=True
    )
    start_date: so.Mapped[datetime.date] = so.mapped_column(sa.Date, nullable=False)
    end_date: so.Mapped[datetime.date] = so.mapped_column(sa.Date, nullable=True)
    notes: so.Mapped[str | None] = so.mapped_column(sa.String(750), nullable=True)
    animal_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey(Animal.id), index=True, nullable=False)

    animal = relationship("Animal")
