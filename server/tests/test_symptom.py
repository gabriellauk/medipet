from datetime import date

import pytest
from dateutil.relativedelta import relativedelta
from flask.testing import FlaskClient
from helpers import create_animal

from app import models
from app.extensions import db


def test_create_symptom(logged_in_client: FlaskClient) -> None:
    animal = create_animal()

    data = {"description": "Some symptom", "date": "2025-01-06"}

    response = logged_in_client.post(f"api/animal/{animal.id}/symptom", json=data)

    assert response.status_code == 201
    assert response.json == {
        "id": 1,
        "description": "Some symptom",
        "date": "2025-01-06",
    }


def test_create_symptom_fails_future_date(logged_in_client: FlaskClient) -> None:
    animal = create_animal()

    data = {"description": "Some symptom", "date": str(date.today() + relativedelta(days=1))}

    response = logged_in_client.post(f"api/animal/{animal.id}/symptom", json=data)

    assert response.status_code == 400
    assert response.json["error"] == "400 Bad Request: Date cannot be in the future"


def test_create_symptom_fails_animal_not_found(logged_in_client: FlaskClient) -> None:
    data = {"description": "Some symptom", "date": "2025-01-06"}

    response = logged_in_client.post("api/animal/404/symptom", json=data)

    assert response.status_code == 400
    assert response.json["error"] == "400 Bad Request: Animal not found"


def test_create_symptom_fails_user_cant_access_animal(logged_in_client: FlaskClient) -> None:
    other_user = models.User(email="some_other@user.com")
    db.session.add(other_user)
    db.session.commit()

    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=other_user)
    db.session.add(animal)
    db.session.commit()

    data = {"description": "Some symptom", "date": "2025-01-06"}

    response = logged_in_client.post(f"api/animal/{animal.id}/symptom", json=data)

    assert response.status_code == 403
    assert response.json["error"] == "403 Forbidden: User cannot access this animal"


def test_get_symptoms_for_animal(logged_in_client: FlaskClient) -> None:
    animal = create_animal()
    symptoms = [
        models.Symptom(description="Some observed behaviour 1", date=date(2024, 12, 10), animal=animal),
        models.Symptom(description="Some observed behaviour 2", date=date(2024, 12, 15), animal=animal),
        models.Symptom(description="Some observed behaviour 3", date=date(2024, 12, 12), animal=animal),
    ]
    db.session.add_all(symptoms)
    db.session.commit()

    response = logged_in_client.get(f"api/animal/{animal.id}/symptom")

    assert response.status_code == 200
    assert response.json == {
        "data": [
            {"description": "Some observed behaviour 2", "date": "2024-12-15", "id": 2},
            {"description": "Some observed behaviour 3", "date": "2024-12-12", "id": 3},
            {"description": "Some observed behaviour 1", "date": "2024-12-10", "id": 1},
        ]
    }


def test_get_symptoms_for_animal_empty_list(logged_in_client: FlaskClient) -> None:
    animal = create_animal()

    response = logged_in_client.get(f"api/animal/{animal.id}/symptom")

    assert response.status_code == 200, response.json
    assert response.json == {"data": []}


def test_get_symptoms_for_animal_fails_animal_not_found(logged_in_client: FlaskClient) -> None:
    response = logged_in_client.get("api/animal/4/symptom")

    assert response.status_code == 400
    assert response.json["error"] == "400 Bad Request: Animal not found"


def test_get_symptoms_for_animal_fails_user_cant_access_animal(logged_in_client: FlaskClient) -> None:
    other_user = models.User(email="some_other@user.com")
    db.session.add(other_user)
    db.session.commit()

    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=other_user)
    db.session.add(animal)
    db.session.commit()

    response = logged_in_client.get(f"api/animal/{animal.id}/symptom")

    assert response.status_code == 403
    assert response.json["error"] == "403 Forbidden: User cannot access this animal"


def test_get_symptom(logged_in_client: FlaskClient) -> None:
    animal = create_animal()
    symptom = models.Symptom(description="Some observed behaviour 1", date=date(2024, 12, 10), animal=animal)
    db.session.add(symptom)
    db.session.commit()

    response = logged_in_client.get(f"api/animal/{animal.id}/symptom/{symptom.id}")

    assert response.status_code == 200
    assert response.json["description"] == symptom.description
    assert response.json["date"] == str(symptom.date)


def test_delete_symptom(logged_in_client: FlaskClient) -> None:
    animal = create_animal()
    symptom = models.Symptom(description="Some observed behaviour 1", date=date(2024, 12, 10), animal=animal)
    db.session.add(symptom)
    db.session.commit()

    response = logged_in_client.delete(f"api/animal/{animal.id}/symptom/{symptom.id}")

    assert response.status_code == 204


def test_delete_symptom_fails_animal_not_found(logged_in_client: FlaskClient) -> None:
    response = logged_in_client.delete("api/animal/4/symptom/1")

    assert response.status_code == 400
    assert response.json["error"] == "400 Bad Request: Animal not found"


def test_delete_symptom_fails_user_cant_access_animal(logged_in_client: FlaskClient) -> None:
    user = models.User(email="some_other@user.com")
    db.session.add(user)
    db.session.commit()

    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=user)
    symptom = models.Symptom(description="Some observed behaviour 1", date=date(2024, 12, 10), animal=animal)
    db.session.add(symptom)
    db.session.commit()

    response = logged_in_client.delete(f"api/animal/{animal.id}/symptom/{symptom.id}")

    assert response.status_code == 403
    assert response.json["error"] == "403 Forbidden: User cannot access this animal"


def test_delete_symptom_fails_symptom_not_found(logged_in_client: FlaskClient) -> None:
    animal = create_animal()

    response = logged_in_client.delete(f"api/animal/{animal.id}/symptom/4")

    assert response.status_code == 400
    assert response.json["error"] == f"400 Bad Request: Symptom 4 not found for animal {animal.id}"


def test_update_symptom(logged_in_client: FlaskClient) -> None:
    animal = create_animal()
    symptom = models.Symptom(description="Some observed behaviour 1", date=date(2024, 12, 10), animal=animal)
    db.session.add(symptom)
    db.session.commit()

    request_data = {"description": "New description", "date": "2025-01-06"}

    response = logged_in_client.patch(f"api/animal/{animal.id}/symptom/{symptom.id}", json=request_data)

    assert response.status_code == 200
    assert response.json["description"] == request_data["description"]
    assert response.json["date"] == request_data["date"]


def test_update_symptom_fails_future_date(logged_in_client: FlaskClient) -> None:
    animal = create_animal()
    symptom = models.Symptom(description="Some observed behaviour 1", date=date(2024, 12, 10), animal=animal)
    db.session.add(symptom)
    db.session.commit()

    request_data = {"date": str(date.today() + relativedelta(days=1))}

    response = logged_in_client.patch(f"api/animal/{animal.id}/symptom/{symptom.id}", json=request_data)

    assert response.status_code == 400
    assert response.json["error"] == "400 Bad Request: Date cannot be in the future"


@pytest.mark.parametrize("field_to_update", ["description", "date"])
def test_update_symptom_partially(logged_in_client: FlaskClient, field_to_update: str) -> None:
    animal = create_animal()
    symptom = models.Symptom(description="Some observed behaviour 1", date=date(2024, 12, 10), animal=animal)
    db.session.add(symptom)
    db.session.commit()

    if field_to_update == "description":
        request_data = {"description": "New description"}
    elif field_to_update == "date":
        request_data = {"date": "2025-01-06"}

    response = logged_in_client.patch(f"api/animal/{animal.id}/symptom/{symptom.id}", json=request_data)

    assert response.status_code == 200

    if field_to_update == "description":
        assert response.json["description"] == request_data["description"]
        assert response.json["date"] == str(symptom.date)
    else:
        assert response.json["description"] == symptom.description
        assert response.json["date"] == request_data["date"]
