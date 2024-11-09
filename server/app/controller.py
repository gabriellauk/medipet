from flask import session

from app.decorators import requires_auth
from app import oauth, store, schemas

from werkzeug.exceptions import BadRequest


@requires_auth
def test_protected(user):
    name = user.get("given_name")
    return name


def auth():
    token = oauth.google.authorize_access_token()
    session["user"] = token["userinfo"]
    user = session.get("user")
    email = user["email"]
    user_exists = store.check_user_exists(email)
    if not user_exists:
        store.create_user(email)


def get_user_login_status():
    user = session.get("user")
    is_logged_in = False
    if user:
        is_logged_in = True

    return is_logged_in


def get_animal_types() -> list[schemas.AnimalType]:
    animal_types = store.get_animal_types()

    return [schemas.AnimalType.model_validate(animal_type) for animal_type in animal_types]


@requires_auth
def create_animal(user, data: schemas.CreateAnimal) -> schemas.Animal:
    if (animal_type := store.get_animal_type_by_id(data.animal_type_id)) is None:
        raise BadRequest("Animal type not found")

    if (user_record := store.get_user_by_email(user["email"])) is None:
        raise BadRequest("User record not found")

    animal = store.create_animal(data.name, animal_type, user_record)

    return schemas.Animal.model_validate(animal)
