from datetime import date
from app import models

from app.extensions import db

from flask.testing import FlaskClient

from helpers import create_animal


def test_create_medication_recurring_finite_period(logged_in_client: FlaskClient) -> None:
    animal = create_animal()

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
        "endDate": "2026-01-06",
    }


def test_create_medication_recurring_forever(logged_in_client: FlaskClient) -> None:
    animal = create_animal()

    data = {
        "name": "Flea treatment",
        "isRecurring": True,
        "timesPerDay": 1,
        "frequencyNumber": 1,
        "frequencyUnit": "month",
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
        "durationNumber": None,
        "durationUnit": None,
        "startDate": "2025-01-06",
        "notes": "Some notes",
        "endDate": None,
    }


def test_create_medication_one_off(logged_in_client: FlaskClient) -> None:
    animal = create_animal()

    data = {
        "name": "Some one-off treatment",
        "isRecurring": False,
        "startDate": "2025-01-06",
        "notes": "Some notes",
    }

    response = logged_in_client.post(f"api/animal/{animal.id}/medication", json=data)

    assert response.status_code == 201
    assert response.json == {
        "id": 1,
        "name": "Some one-off treatment",
        "isRecurring": False,
        "timesPerDay": None,
        "frequencyNumber": None,
        "frequencyUnit": None,
        "durationNumber": None,
        "durationUnit": None,
        "startDate": "2025-01-06",
        "notes": "Some notes",
        "endDate": "2025-01-06",
    }


def test_create_medication_recurring_error_invalid_enum_value(logged_in_client: FlaskClient) -> None:
    animal = create_animal()

    data = {
        "name": "Flea treatment",
        "isRecurring": True,
        "timesPerDay": 1,
        "frequencyNumber": 1,
        "frequencyUnit": "fortnight",
        "startDate": "2025-01-06",
        "notes": "Some notes",
    }

    response = logged_in_client.post(f"api/animal/{animal.id}/medication", json=data)

    assert response.status_code == 422


def test_create_medication_recurring_error_missing_fields(logged_in_client: FlaskClient) -> None:
    animal = create_animal()

    data = {
        "name": "Flea treatment",
        "isRecurring": True,
        "startDate": "2025-01-06",
        "notes": "Some notes",
    }

    response = logged_in_client.post(f"api/animal/{animal.id}/medication", json=data)

    assert response.status_code == 400
    assert (
        response.json["error"]
        == "400 Bad Request: If a medication is recurring, times per day and frequency details must all be provided."
    )


def test_create_medication_one_off_error_extra_fields(logged_in_client: FlaskClient) -> None:
    animal = create_animal()

    data = {
        "name": "Flea treatment",
        "isRecurring": False,
        "frequencyNumber": 1,
        "startDate": "2025-01-06",
        "notes": "Some notes",
    }

    response = logged_in_client.post(f"api/animal/{animal.id}/medication", json=data)

    assert response.status_code == 400
    assert (
        response.json["error"]
        == "400 Bad Request: If a medication is not recurring, times per day, frequency details and duration info should not be provided."
    )


def test_get_medication(logged_in_client: FlaskClient) -> None:
    animal = create_animal()

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
    animal = create_animal()

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
