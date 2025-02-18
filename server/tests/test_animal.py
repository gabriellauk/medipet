import pytest

from flask import current_app

from app import models

from app.extensions import db

from typing import Literal

from flask.testing import FlaskClient


def test_create_animal(logged_in_client: FlaskClient) -> None:
    with logged_in_client.session_transaction() as session:
        user = session.get("user")
        email = user["email"]

    with current_app.app_context():
        user = models.User(email=email)
        db.session.add(user)
        db.session.commit()

    data = {"name": "Fluffy", "animalTypeId": 2}

    response = logged_in_client.post("api/animal", json=data)

    assert response.status_code == 201

    assert response.json == {
        "id": 1,
        "name": "Fluffy",
        "animalTypeId": 2,
    }


def test_create_animal_fails_animal_type_not_found(logged_in_client: FlaskClient) -> None:
    data = {"name": "Fluffy", "animalTypeId": 999}

    response = logged_in_client.post("api/animal", json=data)

    assert response.status_code == 400
    assert response.json["error"] == "400 Bad Request: Animal type not found"


def test_create_animal_fails_user_record_not_found(logged_in_client: FlaskClient) -> None:
    data = {"name": "Fluffy", "animalTypeId": 2}

    response = logged_in_client.post("api/animal", json=data)

    assert response.status_code == 400
    assert response.json["error"] == "400 Bad Request: User record not found"


def test_create_animal_fails_user_not_logged_in(client: FlaskClient) -> None:
    data = {"name": "Fluffy", "animalTypeId": 2}

    response = client.post("api/animal", json=data)

    assert response.status_code == 403
    assert response.json["error"] == "403 Forbidden: No user logged in"


@pytest.mark.parametrize("missing_field", ["name", "animalTypeId"])
def test_create_animal_fails_field_missing(
    logged_in_client: FlaskClient, missing_field: Literal["name"] | Literal["animalTypeId"]
) -> None:
    data = {"animalTypeId": 2} if missing_field == "name" else {"name": "Fluffy"}

    response = logged_in_client.post("api/animal", json=data)

    assert response.status_code == 422


def test_create_animal_fails_empty_string(logged_in_client: FlaskClient) -> None:
    data = {"animal": "", "animalTypeId": 2}

    response = logged_in_client.post("api/animal", json=data)

    assert response.status_code == 422


def test_get_animal(logged_in_client: FlaskClient) -> None:
    with logged_in_client.session_transaction() as session:
        user = session.get("user")
        email = user["email"]

    user = models.User(email=email)
    db.session.add(user)
    db.session.commit()
    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one_or_none()
    assert animal_type
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=user)
    db.session.add(animal)
    db.session.commit()

    response = logged_in_client.get(f"api/animal/{animal.id}")

    assert response.status_code == 200

    assert response.json == {
        "id": 1,
        "name": "Fluffy",
        "animalTypeId": 2,
    }


def test_get_animal_fails_animal_doesnt_exist(logged_in_client: FlaskClient) -> None:
    with logged_in_client.session_transaction() as session:
        user = session.get("user")
        email = user["email"]

    user = models.User(email=email)
    db.session.add(user)
    db.session.commit()

    response = logged_in_client.get("api/animal/1")

    assert response.status_code == 400

    assert response.json["error"] == "400 Bad Request: Animal not found"


def test_get_animal_fails_user_doesnt_have_permission(logged_in_client: FlaskClient) -> None:
    with logged_in_client.session_transaction() as session:
        user = session.get("user")
        email = user["email"]

    logged_in_user_record = models.User(email=email)
    db.session.add(logged_in_user_record)

    user_record = models.User(email="some.other@user.com")
    db.session.add(user_record)
    db.session.commit()
    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one_or_none()
    assert animal_type
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=user_record)
    db.session.add(animal)
    db.session.commit()

    response = logged_in_client.get(f"api/animal/{animal.id}")

    assert response.status_code == 403
    assert response.json["error"] == "403 Forbidden: User cannot access this animal"


def test_get_animals(logged_in_client: FlaskClient) -> None:
    with logged_in_client.session_transaction() as session:
        user = session.get("user")
        email = user["email"]

    user = models.User(email=email)
    other_user = models.User(email="somebody@else.com")
    db.session.add_all([user, other_user])
    db.session.commit()
    animal_type = db.session.query(models.AnimalType).filter(models.AnimalType.id == 2).one_or_none()
    assert animal_type
    animal = models.Animal(name="Fluffy", animal_type=animal_type, user=user)
    other_user_animal = models.Animal(name="Bert", animal_type=animal_type, user=other_user)
    db.session.add_all([animal, other_user_animal])
    db.session.commit()

    response = logged_in_client.get("api/animal")

    assert response.status_code == 200

    assert response.json == {"data": [{"id": 1, "name": "Fluffy", "animalTypeId": 2}]}


def test_get_animals_empty_list(logged_in_client: FlaskClient) -> None:
    with logged_in_client.session_transaction() as session:
        user = session.get("user")
        email = user["email"]

    user = models.User(email=email)
    db.session.add(user)
    db.session.commit()

    response = logged_in_client.get("api/animal")

    assert response.status_code == 200
    assert response.json == {"data": []}
