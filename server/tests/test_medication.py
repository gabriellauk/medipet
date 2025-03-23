from datetime import date
from app import models

from app.extensions import db

from flask.testing import FlaskClient


def test_create_medication_recurring(logged_in_client: FlaskClient) -> None:
    user = db.session.query(models.User).one()
    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=user)
    db.session.add(animal)
    db.session.commit()

    data = {
        "name": "Flea treatment",
        "isRecurring": True,
        "timesPerDay": 1,
        "frequencyNumber": 1,
        "frequencyUnit": "month",
        "durationNumber": 12,
        "durationUnit": "month",
        "startDate": "2025-01-06",
        "notes": "Some notes",
    }

    response = logged_in_client.post(f"api/animal/{animal.id}/medication", json=data)

    assert response.status_code == 201
    assert response.json == {
        "id": 1,
        "name": "Flea treatment",
        "isRecurring": True,
        "timesPerDay": 1,
        "frequencyNumber": 1,
        "frequencyUnit": "month",
        "durationNumber": 12,
        "durationUnit": "month",
        "startDate": "2025-01-06",
        "notes": "Some notes",
        "endDate": "2026-12-01",
    }


def test_create_medication_recurring_error_invalid_enum_value(logged_in_client: FlaskClient) -> None:
    user = db.session.query(models.User).one()
    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=user)
    db.session.add(animal)
    db.session.commit()

    data = {
        "name": "Flea treatment",
        "isRecurring": True,
        "timesPerDay": 1,
        "frequencyNumber": 1,
        "frequencyUnit": "fortnight",
        "durationNumber": 12,
        "durationUnit": "month",
        "startDate": "2025-01-06",
        "notes": "Some notes",
    }

    response = logged_in_client.post(f"api/animal/{animal.id}/medication", json=data)

    assert response.status_code == 422


def test_get_medication(logged_in_client: FlaskClient) -> None:
    user = db.session.query(models.User).one()
    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=user)
    medication = models.Medication(
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
    )
    db.session.add(medication)
    db.session.commit()

    response = logged_in_client.get(f"api/animal/{animal.id}/medication/{medication.id}")

    assert response.status_code == 200
    assert response.json == {
        "id": 1,
        "name": "Flea treatment",
        "isRecurring": True,
        "timesPerDay": 1,
        "frequencyNumber": 1,
        "frequencyUnit": "month",
        "durationNumber": 12,
        "durationUnit": "month",
        "startDate": "2025-01-06",
        "notes": "Some notes",
        "endDate": "2026-12-01",
    }


def test_get_medications_for_animal(logged_in_client: FlaskClient) -> None:
    user = db.session.query(models.User).one()
    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=user)
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

    response = logged_in_client.get(f"api/animal/{animal.id}/medication")

    assert response.status_code == 200
    assert response.json == {
        "data": [
            {
                "id": 1,
                "name": "Flea treatment",
                "isRecurring": True,
                "timesPerDay": 1,
                "frequencyNumber": 1,
                "frequencyUnit": "month",
                "durationNumber": 12,
                "durationUnit": "month",
                "startDate": "2025-01-06",
                "notes": "Some notes",
                "endDate": "2026-12-01",
            },
            {
                "id": 2,
                "name": "Some one-off medication",
                "isRecurring": False,
                "timesPerDay": 1,
                "frequencyNumber": None,
                "frequencyUnit": None,
                "durationNumber": None,
                "durationUnit": None,
                "startDate": "2025-01-06",
                "notes": "Some notes",
                "endDate": "2025-01-06",
            },
        ]
    }
