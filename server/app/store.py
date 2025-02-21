from typing import List

from app import models, schemas

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
    animal = models.Animal(name=name, animal_type=animal_type, user=user)
    db.session.add(animal)
    db.session.commit()

    return animal


def get_animal(animal_id: int) -> models.Animal | None:
    return models.Animal.query.filter(models.Animal.id == animal_id).one_or_none()


def get_animals_for_user(user: models.User) -> List[models.Animal]:
    return models.Animal.query.filter(models.Animal.user == user).all()


def create_symptom(data: schemas.CreateSymptom, animal: models.Animal) -> models.Symptom:
    symptom = models.Symptom(description=data.description, date=data.date, animal=animal)
    db.session.add(symptom)
    db.session.commit()

    return symptom


def get_symptom(symptom_id) -> models.Symptom | None:
    return models.Symptom.query.filter(models.Symptom.id == symptom_id).one_or_none()


def delete_symptom(symptom: models.Symptom) -> None:
    db.session.delete(symptom)
    db.session.commit()


def get_symptoms_for_animal(animal: models.Animal) -> List[models.Symptom]:
    return models.Symptom.query.filter(models.Symptom.animal == animal).order_by(models.Symptom.date.desc()).all()
