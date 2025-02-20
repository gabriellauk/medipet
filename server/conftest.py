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


@pytest.fixture(scope="function")
def session(app):
    with app.app_context():
        db.create_all()
        yield db.session
        db.session.remove()
        db.drop_all()


@pytest.fixture(scope="function")
def client(app, session):
    with app.app_context():
        try:
            session.add_all([AnimalType(name="Cat"), AnimalType(name="Dog"), AnimalType(name="Rabbit")])
            session.commit()
        except Exception:
            session.rollback()
            raise

    client = app.test_client()

    yield client


@pytest.fixture
def logged_in_client(client):
    with client.session_transaction() as session:
        session["user"] = {"given_name": "First name", "family_name": "Second name", "email": "test@test.com"}
    return client
