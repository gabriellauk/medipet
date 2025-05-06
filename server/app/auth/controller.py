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
    user_session = session.get("user")
    if user_session is None or (user := store.get_user_by_email(user_session["email"])) is None:
        raise Unauthorized("Authentication required")
    first_name = user_session.get("given_name", None)
    last_name = user_session.get("family_name", None)

    return schemas.User(first_name=first_name, last_name=last_name, is_demo_account=user.is_demo_account)


def create_demo_account():
    user = store.create_demo_account()
    session["user"] = {"given_name": "Demo", "family_name": "Account", "email": user.email}
