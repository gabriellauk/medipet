from typing import List

from app import models

import sqlalchemy as sa

from app.extensions import db


def check_user_exists(email):
    return db.session.scalar(sa.select(models.User).where(models.User.email == email))


def create_user(email) -> None:
    new_user = models.User(email=email)
    db.session.add(new_user)
    db.session.commit()


def get_animal_types() -> List[models.AnimalType]:
    return models.AnimalType.query.order_by("name").all()


def get_animal_type_by_id(animal_type_id: int) -> models.AnimalType | None:
    return models.AnimalType.query.filter(models.AnimalType.id == animal_type_id).one_or_none()


def get_user_by_email(email: str) -> models.User | None:
    return models.User.query.filter(models.User.email == email).one_or_none()


def create_animal(name: str, animal_type: models.AnimalType, user: models.User) -> models.Animal:
    new_animal = models.Animal(name=name, animal_type=animal_type, user=user)
    db.session.add(new_animal)
    db.session.commit()

    return new_animal
