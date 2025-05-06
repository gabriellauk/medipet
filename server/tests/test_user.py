from flask.testing import FlaskClient

from app.extensions import db
from app import models


def test_get_user(logged_in_client: FlaskClient) -> None:
    response = logged_in_client.get("api/user")

    assert response.status_code == 200
    assert response.json == {"firstName": "First name", "lastName": "Second name", "isDemoAccount": False}


def test_get_user_not_logged_in(client: FlaskClient) -> None:
    response = client.get("api/user")

    assert response.status_code == 401


def test_create_demo_account(client: FlaskClient) -> None:
    assert db.session.query(models.User).count() == 0

    response = client.post("api/login-demo")
    assert response.status_code == 302

    assert db.session.query(models.User).count() == 1

    animals = db.session.query(models.Animal).all()
    assert len(animals) == 1
    assert animals[0].name == "Horatio"

    assert db.session.query(models.Symptom).count() == 7
    assert db.session.query(models.Appointment).count() == 10
    assert db.session.query(models.Medication).count() == 4
    assert db.session.query(models.Weight).count() == 6
