from datetime import date

from app import models
from app.extensions import db


def create_animal() -> models.Animal:
    user = db.session.query(models.User).one()
    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=user)
    db.session.add(animal)
    db.session.commit()

    return animal


def create_medications(animal: models.Animal) -> list[models.Medication]:
    medications = [
        models.Medication(
            name="Flea treatment",
            animal=animal,
            is_recurring=True,
            times_per_day=1,
            frequency_number=1,
            frequency_unit="month",
            duration_number=12,
            duration_unit="month",
            start_date=date(2025, 1, 6),
            end_date=date(2026, 12, 1),
            notes="Some notes",
        ),
        models.Medication(
            name="Some one-off medication",
            animal=animal,
            is_recurring=False,
            times_per_day=1,
            frequency_number=None,
            frequency_unit=None,
            duration_number=None,
            duration_unit=None,
            start_date=date(2025, 1, 6),
            end_date=date(2025, 1, 6),
            notes="Some notes",
        ),
    ]
    db.session.add_all(medications)
    db.session.commit()

    return medications
