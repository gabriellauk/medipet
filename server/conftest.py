import pytest
from app import app as flask_app, db
from app.models import AnimalType


@pytest.fixture(scope="session")
def app():
    flask_app.config.update(
        {
            "TESTING": True,
            "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        }
    )

    with flask_app.app_context():
        db.create_all()

    yield flask_app

    with flask_app.app_context():
        db.drop_all()


@pytest.fixture()
def client(app):
    with app.app_context():
        db.session.add_all([AnimalType(name="Cat"), AnimalType(name="Dog"), AnimalType(name="Rabbit")])
        db.session.commit()

    client = app.test_client()

    yield client

    with app.app_context():
        db.session.remove()
        db.drop_all()
        db.create_all()


@pytest.fixture
def logged_in_client(client):
    with client.session_transaction() as session:
        session["user"] = {"given_name": "First name", "email": "test@test.com"}
    return client
