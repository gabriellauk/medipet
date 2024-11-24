import os
import pytest
from app import create_app
from app.extensions import db
from app.models import AnimalType


@pytest.fixture(scope="session")
def app():
    basedir = os.path.abspath(os.path.dirname(__file__))

    test_config = {"SQLALCHEMY_DATABASE_URI": "sqlite:///" + os.path.join(basedir, "test.db")}
    app = create_app(test_config)

    with app.app_context():
        yield app


@pytest.fixture
def client(app):
    with app.app_context():
        db.create_all()
        db.session.add_all([AnimalType(name="Cat"), AnimalType(name="Dog"), AnimalType(name="Rabbit")])
        db.session.commit()

    client = app.test_client()

    yield client

    with app.app_context():
        db.drop_all()


@pytest.fixture
def logged_in_client(client):
    with client.session_transaction() as session:
        session["user"] = {"given_name": "First name", "email": "test@test.com"}
    return client
