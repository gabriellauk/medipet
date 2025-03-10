from datetime import date
from app import models

from app.extensions import db

from flask.testing import FlaskClient

import pytest


def test_create_appointment(logged_in_client: FlaskClient) -> None:
    user = db.session.query(models.User).one()
    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=user)
    db.session.add(animal)
    db.session.commit()

    data = {"description": "Appt description", "date": "2025-01-06"}

    response = logged_in_client.post(f"api/animal/{animal.id}/appointment", json=data)

    assert response.status_code == 201
    assert response.json == {
        "id": 1,
        "description": data["description"],
        "date": "2025-01-06",
        "notes": None,
    }


def test_create_appointment_fails_animal_not_found(logged_in_client: FlaskClient) -> None:
    data = {"description": "Appt description", "date": "2025-01-06"}

    response = logged_in_client.post("api/animal/404/appointment", json=data)

    assert response.status_code == 400
    assert response.json["error"] == "400 Bad Request: Animal not found"


def test_create_appointment_fails_user_cant_access_animal(logged_in_client: FlaskClient) -> None:
    other_user = models.User(email="some_other@user.com")
    db.session.add(other_user)
    db.session.commit()

    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=other_user)
    db.session.add(animal)
    db.session.commit()

    data = {"description": "Appt description", "date": "2025-01-06"}

    response = logged_in_client.post(f"api/animal/{animal.id}/appointment", json=data)

    assert response.status_code == 403
    assert response.json["error"] == "403 Forbidden: User cannot access this animal"


def test_get_appointment(logged_in_client: FlaskClient) -> None:
    user = db.session.query(models.User).one()
    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=user)
    appointment = models.Appointment(
        description="Appt description", notes="Some notes", date=date(2024, 12, 10), animal=animal
    )
    db.session.add(appointment)
    db.session.commit()

    response = logged_in_client.get(f"api/animal/{animal.id}/appointment/{appointment.id}")

    assert response.status_code == 200
    assert response.json["description"] == appointment.description
    assert response.json["date"] == str(appointment.date)
    assert response.json["notes"] == appointment.notes


def test_get_appointments_for_animal(logged_in_client: FlaskClient) -> None:
    user = db.session.query(models.User).one()
    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=user)
    appointments = [
        models.Appointment(description="Desc 1", notes="Notes 1", date=date(2024, 12, 10), animal=animal),
        models.Appointment(description="Desc 2", notes=None, date=date(2024, 12, 15), animal=animal),
        models.Appointment(description="Desc 3", notes=None, date=date(2024, 12, 12), animal=animal),
    ]
    db.session.add_all(appointments)
    db.session.commit()

    response = logged_in_client.get(f"api/animal/{animal.id}/appointment")

    assert response.status_code == 200
    assert response.json == {
        "data": [
            {"description": "Desc 2", "notes": None, "date": "2024-12-15", "id": 2},
            {"description": "Desc 3", "notes": None, "date": "2024-12-12", "id": 3},
            {"description": "Desc 1", "notes": "Notes 1", "date": "2024-12-10", "id": 1},
        ]
    }


def test_get_appointments_for_animal_empty_list(logged_in_client: FlaskClient) -> None:
    user = db.session.query(models.User).one()
    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=user)
    db.session.add(animal)
    db.session.commit()

    response = logged_in_client.get(f"api/animal/{animal.id}/appointment")

    assert response.status_code == 200, response.json
    assert response.json == {"data": []}


def test_get_appointments_for_animal_fails_animal_not_found(logged_in_client: FlaskClient) -> None:
    response = logged_in_client.get("api/animal/4/appointment")

    assert response.status_code == 400
    assert response.json["error"] == "400 Bad Request: Animal not found"


def test_get_appointments_for_animal_fails_user_cant_access_animal(logged_in_client: FlaskClient) -> None:
    other_user = models.User(email="some_other@user.com")
    db.session.add(other_user)
    db.session.commit()

    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=other_user)
    db.session.add(animal)
    db.session.commit()

    response = logged_in_client.get(f"api/animal/{animal.id}/appointment")

    assert response.status_code == 403
    assert response.json["error"] == "403 Forbidden: User cannot access this animal"


def test_delete_appointment(logged_in_client: FlaskClient) -> None:
    user = db.session.query(models.User).one()
    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=user)
    appointment = models.Appointment(description="Appt description", date=date(2024, 12, 10), animal=animal)
    db.session.add(appointment)
    db.session.commit()

    response = logged_in_client.delete(f"api/animal/{animal.id}/appointment/{appointment.id}")

    assert response.status_code == 204


def test_delete_appointment_fails_animal_not_found(logged_in_client: FlaskClient) -> None:
    response = logged_in_client.delete("api/animal/4/appointment/1")

    assert response.status_code == 400
    assert response.json["error"] == "400 Bad Request: Animal not found"


def test_delete_appointment_fails_user_cant_access_animal(logged_in_client: FlaskClient) -> None:
    user = models.User(email="some_other@user.com")
    db.session.add(user)
    db.session.commit()

    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=user)
    appointment = models.Appointment(
        description="Appt description", notes="Some notes", date=date(2024, 12, 10), animal=animal
    )
    db.session.add(appointment)
    db.session.commit()

    response = logged_in_client.delete(f"api/animal/{animal.id}/weight/{appointment.id}")

    assert response.status_code == 403
    assert response.json["error"] == "403 Forbidden: User cannot access this animal"


def test_delete_appointment_fails_appointment_not_found(logged_in_client: FlaskClient) -> None:
    user = db.session.query(models.User).one()

    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=user)
    db.session.add(animal)
    db.session.commit()

    response = logged_in_client.delete(f"api/animal/{animal.id}/appointment/4")

    assert response.status_code == 400
    assert response.json["error"] == f"400 Bad Request: Appointment 4 not found for animal {animal.id}"


def test_update_appointment(logged_in_client: FlaskClient) -> None:
    user = db.session.query(models.User).one()
    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=user)
    appointment = models.Appointment(
        description="Appt description", notes="Some notes", date=date(2024, 12, 10), animal=animal
    )
    db.session.add(appointment)
    db.session.commit()

    request_data = {"description": "New description", "notes": "New notes", "date": "2025-01-06"}

    response = logged_in_client.patch(f"api/animal/{animal.id}/appointment/{appointment.id}", json=request_data)

    assert response.status_code == 200
    assert response.json["description"] == request_data["description"]
    assert response.json["date"] == request_data["date"]
    assert response.json["notes"] == request_data["notes"]


@pytest.mark.parametrize("field_to_update", ["description", "notes", "date"])
def test_update_appointment_partially(logged_in_client: FlaskClient, field_to_update: str) -> None:
    user = db.session.query(models.User).one()
    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=user)
    appointment = models.Appointment(description="Appt description", notes=None, date=date(2024, 12, 10), animal=animal)
    db.session.add(appointment)
    db.session.commit()

    if field_to_update == "description":
        request_data = {"description": "New desc"}
    elif field_to_update == "date":
        request_data = {"date": "2025-01-06"}
    elif field_to_update == "notes":
        request_data = {"notes": "Some notes"}

    response = logged_in_client.patch(f"api/animal/{animal.id}/appointment/{appointment.id}", json=request_data)

    assert response.status_code == 200

    if field_to_update == "description":
        assert response.json["description"] == request_data["description"]
        assert response.json["notes"] == appointment.notes
        assert response.json["date"] == str(appointment.date)
    elif field_to_update == "date":
        assert response.json["description"] == appointment.description
        assert response.json["notes"] == appointment.notes
        assert response.json["date"] == request_data["date"]
    elif field_to_update == "notes":
        assert response.json["description"] == appointment.description
        assert response.json["notes"] == request_data["notes"]
        assert response.json["date"] == str(appointment.date)
