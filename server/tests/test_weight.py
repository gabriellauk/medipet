from datetime import date
from app import models

from app.extensions import db

from flask.testing import FlaskClient

from dateutil.relativedelta import relativedelta

import pytest
from helpers import create_animal


def test_create_weight(logged_in_client: FlaskClient) -> None:
    animal = create_animal()

    data = {"weight": 4030, "date": "2025-01-06"}

    response = logged_in_client.post(f"api/animal/{animal.id}/weight", json=data)

    assert response.status_code == 201
    assert response.json == {
        "id": 1,
        "weight": 4030,
        "date": "2025-01-06",
    }


def test_create_weight_fails_future_date(logged_in_client: FlaskClient) -> None:
    animal = create_animal()

    data = {"weight": 4030, "date": str(date.today() + relativedelta(days=1))}

    response = logged_in_client.post(f"api/animal/{animal.id}/weight", json=data)

    assert response.status_code == 400
    assert response.json["error"] == "400 Bad Request: Date cannot be in the future"


def test_create_weight_fails_animal_not_found(logged_in_client: FlaskClient) -> None:
    data = {"weight": 4030, "date": "2025-01-06"}

    response = logged_in_client.post("api/animal/404/weight", json=data)

    assert response.status_code == 400
    assert response.json["error"] == "400 Bad Request: Animal not found"


def test_create_weight_fails_user_cant_access_animal(logged_in_client: FlaskClient) -> None:
    other_user = models.User(email="some_other@user.com")
    db.session.add(other_user)
    db.session.commit()

    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=other_user)
    db.session.add(animal)
    db.session.commit()

    data = {"weight": 4030, "date": "2025-01-06"}

    response = logged_in_client.post(f"api/animal/{animal.id}/weight", json=data)

    assert response.status_code == 403
    assert response.json["error"] == "403 Forbidden: User cannot access this animal"


def test_get_weight(logged_in_client: FlaskClient) -> None:
    animal = create_animal()
    weight = models.Weight(weight=4030, date=date(2024, 12, 10), animal=animal)
    db.session.add(weight)
    db.session.commit()

    response = logged_in_client.get(f"api/animal/{animal.id}/weight/{weight.id}")

    assert response.status_code == 200
    assert response.json["weight"] == weight.weight
    assert response.json["date"] == str(weight.date)


def test_get_weights_for_animal(logged_in_client: FlaskClient) -> None:
    animal = create_animal()
    weights = [
        models.Weight(weight=4120, date=date(2024, 12, 10), animal=animal),
        models.Weight(weight=4100, date=date(2024, 12, 15), animal=animal),
        models.Weight(weight=4080, date=date(2024, 12, 12), animal=animal),
    ]
    db.session.add_all(weights)
    db.session.commit()

    response = logged_in_client.get(f"api/animal/{animal.id}/weight")

    assert response.status_code == 200
    assert response.json == {
        "data": [
            {"weight": 4100, "date": "2024-12-15", "id": 2},
            {"weight": 4080, "date": "2024-12-12", "id": 3},
            {"weight": 4120, "date": "2024-12-10", "id": 1},
        ]
    }


def test_get_weights_for_animal_empty_list(logged_in_client: FlaskClient) -> None:
    animal = create_animal()

    response = logged_in_client.get(f"api/animal/{animal.id}/weight")

    assert response.status_code == 200, response.json
    assert response.json == {"data": []}


def test_get_weights_for_animal_fails_animal_not_found(logged_in_client: FlaskClient) -> None:
    response = logged_in_client.get("api/animal/4/weight")

    assert response.status_code == 400
    assert response.json["error"] == "400 Bad Request: Animal not found"


def test_get_weights_for_animal_fails_user_cant_access_animal(logged_in_client: FlaskClient) -> None:
    other_user = models.User(email="some_other@user.com")
    db.session.add(other_user)
    db.session.commit()

    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=other_user)
    db.session.add(animal)
    db.session.commit()

    response = logged_in_client.get(f"api/animal/{animal.id}/weight")

    assert response.status_code == 403
    assert response.json["error"] == "403 Forbidden: User cannot access this animal"


def test_delete_weight(logged_in_client: FlaskClient) -> None:
    animal = create_animal()
    weight = models.Weight(weight=4030, date=date(2024, 12, 10), animal=animal)
    db.session.add(weight)
    db.session.commit()

    response = logged_in_client.delete(f"api/animal/{animal.id}/weight/{weight.id}")

    assert response.status_code == 204


def test_delete_weight_fails_animal_not_found(logged_in_client: FlaskClient) -> None:
    response = logged_in_client.delete("api/animal/4/weight/1")

    assert response.status_code == 400
    assert response.json["error"] == "400 Bad Request: Animal not found"


def test_delete_weight_fails_user_cant_access_animal(logged_in_client: FlaskClient) -> None:
    other_user = models.User(email="some_other@user.com")
    db.session.add(other_user)
    db.session.commit()

    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=other_user)
    weight = models.Weight(weight=4030, date=date(2024, 12, 10), animal=animal)
    db.session.add(weight)
    db.session.commit()

    response = logged_in_client.delete(f"api/animal/{animal.id}/weight/{weight.id}")

    assert response.status_code == 403
    assert response.json["error"] == "403 Forbidden: User cannot access this animal"


def test_delete_weight_fails_weight_not_found(logged_in_client: FlaskClient) -> None:
    animal = create_animal()
    db.session.commit()

    response = logged_in_client.delete(f"api/animal/{animal.id}/weight/4")

    assert response.status_code == 400
    assert response.json["error"] == f"400 Bad Request: Weight 4 not found for animal {animal.id}"


def test_update_weight(logged_in_client: FlaskClient) -> None:
    animal = create_animal()
    weight = models.Weight(weight=4030, date=date(2024, 12, 10), animal=animal)
    db.session.add(weight)
    db.session.commit()

    request_data = {"weight": 4120, "date": "2025-01-06"}

    response = logged_in_client.patch(f"api/animal/{animal.id}/weight/{weight.id}", json=request_data)

    assert response.status_code == 200
    assert response.json["weight"] == request_data["weight"]
    assert response.json["date"] == request_data["date"]


@pytest.mark.parametrize("field_to_update", ["weight", "date"])
def test_update_weight_partially(logged_in_client: FlaskClient, field_to_update: str) -> None:
    animal = create_animal()
    weight = models.Weight(weight=4030, date=date(2024, 12, 10), animal=animal)
    db.session.add(weight)
    db.session.commit()

    if field_to_update == "weight":
        request_data = {"weight": 4120}
    elif field_to_update == "date":
        request_data = {"date": "2025-01-06"}

    response = logged_in_client.patch(f"api/animal/{animal.id}/weight/{weight.id}", json=request_data)

    assert response.status_code == 200

    if field_to_update == "weight":
        assert response.json["weight"] == request_data["weight"]
        assert response.json["date"] == str(weight.date)
    else:
        assert response.json["weight"] == weight.weight
        assert response.json["date"] == request_data["date"]


def test_update_weight_fails_future_date(logged_in_client: FlaskClient) -> None:
    animal = create_animal()
    weight = models.Weight(weight=4030, date=date(2024, 12, 10), animal=animal)
    db.session.add(weight)
    db.session.commit()

    data = {"date": str(date.today() + relativedelta(days=1))}

    response = logged_in_client.patch(f"api/animal/{animal.id}/weight/{weight.id}", json=data)

    assert response.status_code == 400
    assert response.json["error"] == "400 Bad Request: Date cannot be in the future"
