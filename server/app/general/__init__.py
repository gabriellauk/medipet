from flask import Blueprint

general = Blueprint("general", __name__)

from . import routes as routes  # noqa: E402
