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
