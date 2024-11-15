from flask import session

from app import store

from app.extensions import oauth


def authenticate():
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
