from flask import redirect, session, url_for, current_app, jsonify

from . import controller

from . import auth

from app.extensions import oauth


@auth.route("/api/login", methods=["POST"])
def login():
    redirect_uri = url_for("auth.authenticate", _external=True)
    return oauth.google.authorize_redirect(redirect_uri)


@auth.route("/api/auth")
def authenticate():
    controller.authenticate()
    REDIRECT_URL = current_app.config["CORS_ORIGINS"] + "/test"
    return redirect(REDIRECT_URL)


@auth.route("/api/user", methods=["GET"])
def get_user():
    is_logged_in = controller.get_user_login_status()
    return jsonify({"isLoggedIn": is_logged_in})


@auth.route("/api/logout", methods=["POST"])
def logout():
    session.pop("user", None)
    REDIRECT_URL = current_app.config["CORS_ORIGINS"] + "/test"
    return redirect(REDIRECT_URL)
