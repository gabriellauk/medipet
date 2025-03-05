from datetime import date
from app import models

from app.extensions import db

from flask.testing import FlaskClient


def test_create_weight(logged_in_client: FlaskClient) -> None:
    user = db.session.query(models.User).one()
    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=user)
    db.session.add(animal)
    db.session.commit()

    data = {"weight": 403, "date": "2025-01-06"}

    response = logged_in_client.post(f"api/animal/{animal.id}/weight", json=data)

    assert response.status_code == 201
    assert response.json == {
        "id": 1,
        "weight": 403,
        "date": "2025-01-06",
    }


def test_create_weight_fails_animal_not_found(logged_in_client: FlaskClient) -> None:
    data = {"weight": 403, "date": "2025-01-06"}

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

    data = {"weight": 403, "date": "2025-01-06"}

    response = logged_in_client.post(f"api/animal/{animal.id}/weight", json=data)

    assert response.status_code == 403
    assert response.json["error"] == "403 Forbidden: User cannot access this animal"


def test_delete_weight(logged_in_client: FlaskClient) -> None:
    user = db.session.query(models.User).one()
    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=user)
    weight = models.Weight(weight=403, date=date(2024, 12, 10), animal=animal)
    db.session.add(weight)
    db.session.commit()

    response = logged_in_client.delete(f"api/animal/{animal.id}/weight/{weight.id}")

    assert response.status_code == 204


def test_delete_weight_fails_animal_not_found(logged_in_client: FlaskClient) -> None:
    response = logged_in_client.delete("api/animal/4/weight/1")

    assert response.status_code == 400
    assert response.json["error"] == "400 Bad Request: Animal not found"


def test_delete_weight_fails_user_cant_access_animal(logged_in_client: FlaskClient) -> None:
    user = models.User(email="some_other@user.com")
    db.session.add(user)
    db.session.commit()

    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=user)
    weight = models.Weight(weight=403, date=date(2024, 12, 10), animal=animal)
    db.session.add(weight)
    db.session.commit()

    response = logged_in_client.delete(f"api/animal/{animal.id}/weight/{weight.id}")

    assert response.status_code == 403
    assert response.json["error"] == "403 Forbidden: User cannot access this animal"


def test_delete_weight_fails_weight_not_found(logged_in_client: FlaskClient) -> None:
    user = db.session.query(models.User).one()

    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one()
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=user)
    db.session.add(animal)
    db.session.commit()

    response = logged_in_client.delete(f"api/animal/{animal.id}/weight/4")

    assert response.status_code == 400
    assert response.json["error"] == f"400 Bad Request: Weight 4 not found for animal {animal.id}"
