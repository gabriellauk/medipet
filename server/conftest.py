import pytest
from app import app as flask_app


@pytest.fixture()
def app():
    flask_app.config.update(
        {
            "TESTING": True,
        }
    )

    yield flask_app


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture
def logged_in_client(client):
    with client.session_transaction() as session:
        session["user"] = {"given_name": "First name", "email": "test@test.com"}
    return client
