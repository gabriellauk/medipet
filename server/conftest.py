import os
from collections.abc import Generator, Iterator
from typing import Any

import pytest
from flask import Flask
from flask.testing import FlaskClient
from sqlalchemy.orm import Session, scoped_session

from app import create_app
from app.extensions import db
from app.models import AnimalType, User


@pytest.fixture(scope="session")
def app() -> Iterator[Flask]:
    basedir = os.path.abspath(os.path.dirname(__file__))

    test_config = {"SQLALCHEMY_DATABASE_URI": "sqlite:///" + os.path.join(basedir, "test.db")}
    app = create_app(test_config)

    with app.app_context():
        yield app


@pytest.fixture(scope="function")
def session(app: Flask) -> Generator[scoped_session[Session], Any, None]:
    with app.app_context():
        db.create_all()
        yield db.session
        db.session.remove()
        db.drop_all()


@pytest.fixture(scope="function")
def client(app: Flask, session: scoped_session[Session]) -> Generator[FlaskClient, Any, None]:
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
def logged_in_client(app: Flask, session: scoped_session[Session], client: FlaskClient) -> FlaskClient:
    with app.app_context():
        try:
            session.add(User(email="test@test.com"))
            session.commit()
        except Exception:
            session.rollback()
            raise

    with client.session_transaction() as session:
        session["user"] = {"given_name": "First name", "family_name": "Second name", "email": "test@test.com"}
    return client
