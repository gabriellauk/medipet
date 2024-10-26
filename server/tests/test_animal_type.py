def test_get_animal_type(client):
    response = client.get("api/animal-type")
    assert response.status_code == 200

    assert response.json == {
        "data": [
            {"id": 1, "name": "Cat"},
            {"id": 2, "name": "Dog"},
            {"id": 3, "name": "Rabbit"},
        ]
    }
