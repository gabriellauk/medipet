from flask import session
from functools import wraps

from werkzeug.exceptions import Unauthorized

from app import store


class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user_session = session.get("user")
        if user_session is None or (user := store.get_user_by_email(user_session["email"])) is None:
            raise Unauthorized("No user logged in")

        return f(user, *args, **kwargs)

    return decorated
