from datetime import datetime
import sqlalchemy as sa
import sqlalchemy.orm as so
from sqlalchemy.orm import relationship
from flask_login import UserMixin

from app.extensions import db


class User(UserMixin, db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    email: so.Mapped[str] = so.mapped_column(sa.String(120), index=True, unique=True)

    def __repr__(self):
        return "<User {}>".format(self.email)


class AnimalType(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(30), index=True, unique=True)


class Animal(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(30), index=True)
    user_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey(User.id), index=True)
    animal_type_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey(AnimalType.id), index=True)

    user = relationship("User")
    animal_type = relationship("AnimalType")


class Symptom(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    description: so.Mapped[str] = so.mapped_column(sa.String(240), index=True)
    date: so.Mapped[datetime.date] = so.mapped_column(sa.Date, index=True)
    animal_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey(Animal.id), index=True)

    animal = relationship("Animal")
