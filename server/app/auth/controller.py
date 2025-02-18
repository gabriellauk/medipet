from flask import session

from app import store

from app.extensions import oauth
from app import schemas

from werkzeug.exceptions import Unauthorized


def authenticate():
    token = oauth.google.authorize_access_token()
    session["user"] = token["userinfo"]
    user = session.get("user")
    email = user["email"]
    user_exists = store.check_user_exists(email)
    if not user_exists:
        store.create_user(email)


def get_user() -> schemas.User:
    user = session.get("user")
    if user is None:
        raise Unauthorized("Authentication required")
    first_name = user.get("given_name", None)
    last_name = user.get("family_name", None)

    return schemas.User(first_name=first_name, last_name=last_name)
