from flask import session

from app.decorators import requires_auth
from app import oauth, store


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


def get_animal_types():
    animal_types = store.get_animal_types()

    return [{"id": animal_type.id, "name": animal_type.name} for animal_type in animal_types]
