def test_test(client):
    response = client.get("/api/test")
    assert response.status_code == 200
    assert response.json == {"name": "testing", "numbers": [1, 2, 3]}


def test_test_protected_logged_in(logged_in_client):
    response = logged_in_client.get("api/test-protected")
    assert response.status_code == 200
    assert response.json == {"name": "First name", "numbers": [1, 2, 3]}


def test_test_protected_not_logged_in(client):
    response = client.get("api/test-protected")
    assert response.status_code == 403
