from app import models, db, app as flask_app


def test_create_animal(logged_in_client):
    with logged_in_client.session_transaction() as session:
        user = session.get("user")
        email = user["email"]

    with flask_app.app_context():
        new_user = models.User(email=email)
        db.session.add(new_user)
        db.session.commit()

    data = {"name": "Fluffy", "animalTypeId": 2}

    response = logged_in_client.post("api/animal", json=data)

    assert response.status_code == 201

    assert response.json == {
        "id": 1,
        "name": "Fluffy",
        "animalTypeId": 2,
    }


def test_create_animal_fails_animal_type_not_found(logged_in_client):
    data = {"name": "Fluffy", "animalTypeId": 999}

    response = logged_in_client.post("api/animal", json=data)

    assert response.status_code == 400
    assert response.json["error"] == "Animal type not found"


def test_create_animal_fails_user_record_not_found(logged_in_client):
    data = {"name": "Fluffy", "animalTypeId": 2}

    response = logged_in_client.post("api/animal", json=data)

    assert response.status_code == 400
    assert response.json["error"] == "User record not found"


def test_create_animal_fails_user_not_logged_in(client):
    data = {"name": "Fluffy", "animalTypeId": 2}

    response = client.post("api/animal", json=data)

    assert response.status_code == 403
    assert response.json["error"] == "No user logged in"


def test_create_animal_fails_field_missing(logged_in_client):
    data = {"animalTypeId": 2}

    response = logged_in_client.post("api/animal", json=data)

    assert response.status_code == 422
