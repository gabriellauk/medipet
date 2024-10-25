from flask import session
from functools import wraps

from werkzeug.exceptions import Forbidden



class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user = session.get("user")
        if user is None:
            raise Forbidden()

        return f(user, *args, **kwargs)

    return decorated
