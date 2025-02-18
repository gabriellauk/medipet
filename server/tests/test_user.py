from flask.testing import FlaskClient


def test_get_user(logged_in_client: FlaskClient) -> None:
    response = logged_in_client.get("api/user")
    assert response.status_code == 200

    assert response.json == {"firstName": "First name", "lastName": "Second name"}


def test_get_user_not_logged_in(client: FlaskClient) -> None:
    response = client.get("api/user")
    assert response.status_code == 401
